const BookingRepository = require('../infrastructure/repositories/MongoBookingRepository');
const bookingRepository = new BookingRepository();
const crypto = require('crypto');

// Create MoMo payment URL for movie booking
const createMomoPaymentUrl = async (bookingId) => {
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
    const redirectUrl = process.env.MOMO_REDIRECT_URL || `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/payments/momo/return`;
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

    // Make request to MoMo API
    const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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

module.exports = {
  createMomoPaymentUrl,
  verifyMomoResponse
};