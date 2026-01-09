const express = require('express');
const router = express.Router();
const { createMomoPaymentUrl, verifyMomoResponse, processPaymentResult } = require('../application/PaymentService');
const BookingRepository = require('../infrastructure/repositories/MongoBookingRepository');
const bookingRepository = new BookingRepository();

// Create payment URL for a booking
router.post('/create/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { redirectUrl: customRedirectUrl } = req.body;

    // Get booking to check payment method preference
    const booking = await bookingRepository.findById(bookingId);
    let paymentUrl;

    // Check if booking specifies a payment method
    if (booking && booking.paymentMethod === 'momo') {
      paymentUrl = await createMomoPaymentUrl(bookingId, customRedirectUrl);
    } else if (booking && booking.paymentMethod === 'cash') {
      // For cash payment, return a success response directly
      return res.json({
        code: '00',
        data: {
          paymentUrl: null,
          paymentMethod: 'cash',
          message: 'Cash payment selected'
        }
      });
    } else {
      // Default to MoMo if no preference specified
      paymentUrl = await createMomoPaymentUrl(bookingId, customRedirectUrl);
    }

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

// Create specific route for MoMo payments
router.post('/create-momo/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { redirectUrl: customRedirectUrl } = req.body;

    const paymentUrl = await createMomoPaymentUrl(bookingId, customRedirectUrl);

    res.json({
      code: '00',
      data: paymentUrl
    });
  } catch (error) {
    console.error('Error creating MoMo payment URL:', error);
    res.status(500).json({
      code: '02',
      message: error.message || 'Error creating MoMo payment URL'
    });
  }
});

// MoMo callback route (IPN - Instant Payment Notification)
router.post('/momo/callback', async (req, res) => {
  try {
    const momoResponse = req.body;

    console.log('MoMo callback received:', momoResponse);

    // Verify the response signature
    const isValid = verifyMomoResponse(momoResponse);

    if (isValid) {
      const result = await processPaymentResult(momoResponse);

      if (result.success) {
        console.log(`MoMo Payment successful for booking ${momoResponse.orderId}`);
        res.json({
          resultCode: 0,
          message: 'IPN processed successfully'
        });
      } else {
        console.log(`MoMo Payment failed for booking ${momoResponse.orderId}: ${result.message}`);
        res.json({
          resultCode: 1,
          message: 'IPN processed but payment failed'
        });
      }
    } else {
      // Invalid signature
      console.log('Invalid MoMo signature');

      // Respond with error
      res.status(400).json({
        resultCode: 1,
        message: 'Invalid signature'
      });
    }
  } catch (error) {
    console.error('Error processing MoMo callback:', error);

    // Respond with error
    res.status(500).json({
      resultCode: 1,
      message: 'Error processing callback'
    });
  }
});

// MoMo return URL (user gets redirected here after payment)
router.get('/momo/return', async (req, res) => {
  try {
    const momoResponse = req.query;
    const { orderId, resultCode, message } = momoResponse;

    console.log('MoMo return received:', momoResponse);

    // Process booking status update on return as well since callback might not always trigger
    if (orderId && resultCode) {
      try {
        await processPaymentResult(momoResponse);
      } catch (err) {
        console.error('Error updating booking status from return handler:', err);
      }
    }

    // Redirect user to frontend payment result page
    let redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?bookingId=${orderId}&paymentMethod=momo`;

    if (resultCode) {
      redirectUrl += `&resultCode=${resultCode}`;
    }
    if (message) {
      redirectUrl += `&message=${encodeURIComponent(message)}`;
    }

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error processing MoMo return:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/result?paymentMethod=momo&resultCode=error`);
  }
});

module.exports = router;