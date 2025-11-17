const express = require('express');
const router = express.Router();
const { createVnPayPaymentUrl, verifyVnPayResponse } = require('../application/PaymentService');
const BookingRepository = require('../infrastructure/repositories/MongoBookingRepository');
const bookingRepository = new BookingRepository();

// Create payment URL for a booking
router.post('/create/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                    (req.connection.socket ? req.connection.socket.remoteAddress : null);
    
    const paymentUrl = await createVnPayPaymentUrl(bookingId, clientIp);
    
    res.json({
      code: '00',
      data: paymentUrl
    });
  } catch (error) {
    console.error('Error creating payment URL:', error);
    res.status(500).json({
      code: '02',
      message: error.message || 'Error creating payment URL'
    });
  }
});

// VNPAY callback route
router.get('/vnpay/callback', async (req, res) => {
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    
    // Remove secure hash for verification
    const queryParams = { ...vnp_Params };
    delete queryParams['vnp_SecureHash'];
    delete queryParams['vnp_SecureHashType'];

    // Verify response
    const isValid = verifyVnPayResponse(vnp_Params);

    if (isValid) {
      const orderId = vnp_Params['vnp_TxnRef'];
      const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
      const vnp_Amount = vnp_Params['vnp_Amount'] / 100; // Convert back from pennies

      if (vnp_ResponseCode === '00') {
        // Payment successful
        // Update booking status to paid
        const booking = await bookingRepository.findById(orderId);
        if (booking) {
          booking.status = 'confirmed';
          await bookingRepository.update(orderId, booking);
        }

        console.log(`Payment successful for booking ${orderId}`);

        // Redirect user to frontend payment result page
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?bookingId=${orderId}&vnp_ResponseCode=${vnp_ResponseCode}`);
      } else {
        // Payment failed
        console.log(`Payment failed for booking ${orderId}: ${vnp_Params['vnp_ResponseCode']}`);

        // Redirect user to frontend payment result page
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?bookingId=${orderId}&vnp_ResponseCode=${vnp_ResponseCode}`);
      }
    } else {
      // Invalid signature
      console.log('Invalid signature');
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?bookingId=${vnp_Params['vnp_TxnRef']}&vnp_ResponseCode=invalid_signature`);
    }
  } catch (error) {
    console.error('Error processing VNPAY callback:', error);
    // Create a fallback redirect without specific booking ID if we can't process the error
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?vnp_ResponseCode=error_processing`);
  }
});

module.exports = router;