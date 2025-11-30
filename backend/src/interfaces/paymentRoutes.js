const express = require('express');
const router = express.Router();
const { createMomoPaymentUrl, verifyMomoResponse } = require('../application/PaymentService');
const BookingRepository = require('../infrastructure/repositories/MongoBookingRepository');
const bookingRepository = new BookingRepository();

// Create payment URL for a booking
router.post('/create/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Get booking to check payment method preference
    const booking = await bookingRepository.findById(bookingId);
    let paymentUrl;

    // Check if booking specifies a payment method
    if (booking && booking.paymentMethod === 'momo') {
      paymentUrl = await createMomoPaymentUrl(bookingId);
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
      paymentUrl = await createMomoPaymentUrl(bookingId);
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

    const paymentUrl = await createMomoPaymentUrl(bookingId);

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
      const orderId = momoResponse.orderId;
      const resultCode = momoResponse.resultCode;
      const transId = momoResponse.transId;
      const amount = momoResponse.amount;

      if (resultCode === 0) {
        // Payment successful
        // Update booking status to paid
        const booking = await bookingRepository.findById(orderId);
        if (booking) {
          booking.status = 'confirmed';
          booking.paymentId = transId; // Store MoMo transaction ID
          await bookingRepository.update(orderId, booking);
        }

        console.log(`MoMo Payment successful for booking ${orderId}, transaction ID: ${transId}`);

        // Respond to MoMo that IPN was received successfully
        res.json({
          resultCode: 0,
          message: 'IPN processed successfully'
        });
      } else {
        // Payment failed
        console.log(`MoMo Payment failed for booking ${orderId}: ${momoResponse.message}`);

        // Respond to MoMo that IPN was processed
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
    const { orderId, resultCode, message } = req.query;

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