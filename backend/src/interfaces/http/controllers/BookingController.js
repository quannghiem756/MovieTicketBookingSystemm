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
      
      // Content Negotiation
      const acceptHeader = req.get('Accept') || '';
      
      if (acceptHeader.includes('text/html')) {
        const statusColor = result.status === 'valid' ? '#4caf50' : '#f44336';
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Validation</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .card { background: white; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); padding: 30px; width: 90%; max-width: 400px; text-align: center; }
        .status { font-size: 2.5rem; font-weight: bold; color: ${statusColor}; margin-bottom: 20px; text-transform: uppercase; border-bottom: 3px solid ${statusColor}; padding-bottom: 10px; }
        .details { text-align: left; background: #fafafa; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .details-row { margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .label { font-weight: bold; color: #666; font-size: 0.9rem; }
        .value { color: #333; font-size: 1.1rem; }
        .message { margin-top: 20px; padding: 10px; border-radius: 4px; background: #fff3e0; color: #e65100; font-weight: 500; }
    </style>
</head>
<body>
    <div class="card">
        <div class="status">${result.status}</div>
        ${result.booking ? `
            <div class="details">
                <div class="details-row">
                    <div class="label">Booking ID</div>
                    <div class="value">${result.booking.id}</div>
                </div>
                <div class="details-row">
                    <div class="label">Seats</div>
                    <div class="value">${result.booking.seats.join(', ')}</div>
                </div>
            </div>
        ` : ''}
        ${result.message ? `<div class="message">${result.message}</div>` : ''}
    </div>
</body>
</html>`;
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
      }

      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = BookingController;