const BookingRepository = require('../infrastructure/repositories/MongoBookingRepository');
const ValidationService = require('./ValidationService');
const bookingRepository = new BookingRepository();
const validationService = new ValidationService();
const crypto = require('crypto');

let bookingService = null;

// Create MoMo payment URL for movie booking
const createMomoPaymentUrl = async (bookingId, customRedirectUrl = null) => {
  try {
    // Get the booking information
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // MoMo payment configuration
    const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
    const accessKey = process.env.MOMO_ACCESS_KEY || 'access_key';
    const secretKey = process.env.MOMO_SECRET_KEY || 'secret_key';
    const requestId = `${bookingId}-${Date.now()}`;
    const orderId = bookingId.toString();
    const orderInfo = `Thanh toan cho don dat ve phim ${bookingId.toString()}`;
    
    // Determine the base redirect URL (Backend Endpoint)
    const baseRedirectUrl = process.env.MOMO_REDIRECT_URL || `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/payments/momo/return`;
    
    // If a custom redirect URL is provided (e.g. from mobile app), append it as a query parameter
    let redirectUrl = baseRedirectUrl;
    if (customRedirectUrl) {
      const separator = baseRedirectUrl.includes('?') ? '&' : '?';
      redirectUrl = `${baseRedirectUrl}${separator}clientRedirect=${encodeURIComponent(customRedirectUrl)}`;
    }

    const ipnUrl = process.env.MOMO_IPN_URL || `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/payments/momo/callback`;
    const amount = booking.totalPrice.toString(); // Amount in VND
    const requestType = 'payWithMethod';
    const extraData = ''; // Pass empty value if not using extraData

    // Construct the raw signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Create signature
    const signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    // Create request object
    const requestBody = {
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      requestType: requestType,
      signature: signature,
      extraData: extraData
    };

    // MoMo API Endpoint
    const momoEndpoint = process.env.MOMO_API_URL || 'https://test-payment.momo.vn/v2/gateway/api/create';

    // Make request to MoMo API
    const response = await fetch(momoEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (data.payUrl) {
      console.log('MoMo payment URL created successfully:', data);
      return data.payUrl;
    } else {
      console.error('Error creating MoMo payment URL:', data);
      throw new Error(data.message || 'Failed to create MoMo payment URL');
    }
  } catch (error) {
    console.error('Error creating MoMo payment URL:', error);
    throw error;
  }
};

// Verify MoMo payment response
const verifyMomoResponse = (momoResponse) => {
  const secretKey = process.env.MOMO_SECRET_KEY || 'secret_key';

  // Extract required parameters for signature verification
  const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, message, responseTime, resultCode, extraData, signature } = momoResponse;

  // Create raw signature string in alphabetical order
  const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY || 'access_key'}&amount=${amount || ''}&extraData=${extraData || ''}&message=${message || ''}&orderId=${orderId || ''}&orderInfo=${orderInfo || ''}&orderType=${orderType || ''}&partnerCode=${partnerCode || ''}&requestId=${requestId || ''}&responseTime=${responseTime || ''}&resultCode=${resultCode || ''}&transId=${transId || ''}`;

  // Create signature to compare
  const computedSignature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  console.log('MoMo verification - provided signature:', signature);
  console.log('MoMo verification - computed signature:', computedSignature);

  return computedSignature === signature;
};

// Process the payment result and update booking status
const processPaymentResult = async (momoResponse) => {
  const { orderId, resultCode, transId, message } = momoResponse;

  const booking = await bookingRepository.findById(orderId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  // Idempotency check: if booking is already confirmed, return success
  if (booking.status === 'confirmed') {
    console.log(`Booking ${orderId} is already confirmed. Skipping update.`);
    return { success: true, booking, alreadyProcessed: true };
  }

  // Map MoMo result code to booking status
  // 0: success, others: failed
  if (parseInt(resultCode) === 0) {
    booking.status = 'confirmed';
    booking.paymentId = transId;
    
    if (!booking.validationToken) {
      booking.validationToken = validationService.generateValidationToken(orderId);
    }

    const result = await bookingRepository.update(orderId, booking);
    
    // Send confirmation email if BookingService is available
    if (bookingService) {
      await bookingService._sendConfirmationEmail(result);
    }
    
    return { success: true, booking };
  } else {
    booking.status = 'cancelled';
    await bookingRepository.update(orderId, booking);
    console.log(`Booking ${orderId} marked as cancelled due to payment failure: ${message}`);
    return { success: false, booking, message };
  }
};

// Set BookingService instance (call this during initialization)
const setBookingService = (service) => {
  bookingService = service;
};

module.exports = {
  createMomoPaymentUrl,
  verifyMomoResponse,
  processPaymentResult,
  setBookingService
};