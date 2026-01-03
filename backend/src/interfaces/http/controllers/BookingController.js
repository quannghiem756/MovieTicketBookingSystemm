const BookingService = require('../../../application/BookingService');

class BookingController {
  constructor(bookingService) {
    this.bookingService = bookingService;
  }

  async createBooking(req, res) {
    try {
      const booking = await this.bookingService.createBooking(req.body);
      
      // Emit update to lock seats permanently (status changed to confirmed/paid)
      const io = req.app.get('io');
      if (io) {
          // Send list of seats that are now confirmed
          booking.seatIds.forEach(seatId => {
              io.to(booking.showtimeId).emit('seat_confirmed', { seatId });
          });
      }

      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllBookings(req, res) {
    try {
      const bookings = await this.bookingService.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBookingById(req, res) {
    try {
      const booking = await this.bookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBookingsByUserId(req, res) {
    try {
      const bookings = await this.bookingService.getBookingsByUserId(req.params.userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async confirmBooking(req, res) {
    try {
      const booking = await this.bookingService.confirmBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async cancelBooking(req, res) {
    try {
      const booking = await this.bookingService.cancelBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async holdSeat(req, res) {
    try {
      const { showtimeId, seatId } = req.body;
      const userId = req.user.id; // From auth middleware
      const booking = await this.bookingService.holdSeat(userId, showtimeId, seatId);
      
      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        io.to(showtimeId).emit('seat_held', { seatId, userId });
      }

      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async releaseSeat(req, res) {
    try {
      const { showtimeId, seatId } = req.body;
      const userId = req.user.id;
      const result = await this.bookingService.releaseSeat(userId, showtimeId, seatId);
      
      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        io.to(showtimeId).emit('seat_released', { seatId });
      }

      res.json(result || { message: 'Seat released' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getLockedSeats(req, res) {
    try {
      const { showtimeId } = req.params;
      const lockedSeats = await this.bookingService.getLockedSeats(showtimeId);
      res.json(lockedSeats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async validateBooking(req, res) {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const result = await this.bookingService.validateBooking(token);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = BookingController;