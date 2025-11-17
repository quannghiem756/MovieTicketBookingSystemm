const BookingRepository = require('../infrastructure/repositories/MongoBookingRepository');
const bookingRepository = new BookingRepository();
const crypto = require('crypto');
const qs = require('qs');
const moment = require('moment-timezone');

// Utility function to sort object properties
const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
};

// Create VNPAY payment URL for movie booking
const createVnPayPaymentUrl = async (bookingId, clientIp) => {
  try {
    // Get the booking information
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_SECRET_KEY;
    const locale = 'vn';
    const currCode = 'VND';
    const returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:3004/api/payments/vnpay/callback'; // Backend callback URL to process payment result
    const amount = booking.totalPrice; // Total price from booking
    const createDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
    const orderInfo = `Thanh toan cho don dat ve phim ${bookingId.toString()}`;
    const ipAddr = clientIp || '127.0.0.1';
    
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = bookingId.toString();
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = 'ticket';
    vnp_Params['vnp_Amount'] = amount * 100; // Convert to VND pennies
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    
    // Optional: Set expiry date for payment (e.g., 1 day from now)
    // vnp_Params['vnp_ExpireDate'] = moment().add(1, 'days').tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
    
    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    
    console.log('VNPAY Parameters:', qs.stringify(vnp_Params, { encode: false }));

    const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

    return paymentUrl;
  } catch (error) {
    console.error('Error creating VNPAY payment URL:', error);
    throw error;
  }
};

// Verify VNPAY response
const verifyVnPayResponse = (vnp_Params) => {
  const secretKey = process.env.VNP_SECRET_KEY;
  let secureHash = vnp_Params['vnp_SecureHash'];
  
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  return secureHash === signed;
};

module.exports = {
  createVnPayPaymentUrl,
  verifyVnPayResponse
};