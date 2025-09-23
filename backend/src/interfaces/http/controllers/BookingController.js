const BookingService = require('../../../application/BookingService');

class BookingController {
  constructor(bookingService) {
    this.bookingService = bookingService;
  }

  async createBooking(req, res) {
    try {
      const booking = await this.bookingService.createBooking(req.body);
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
}

module.exports = BookingController;