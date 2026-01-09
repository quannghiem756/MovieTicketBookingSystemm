const Booking = require('../domain/Booking');
const User = require('../domain/User');
const emailTemplates = require('../infrastructure/EmailTemplates');

class BookingService {
  constructor(bookingRepository, userRepository, showtimeRepository, movieRepository, couponService, validationService, emailService, theaterRepository, auditLogRepository) {
    this.bookingRepository = bookingRepository;
    this.userRepository = userRepository;
    this.showtimeRepository = showtimeRepository;
    this.movieRepository = movieRepository;
    this.couponService = couponService;
    this.validationService = validationService;
    this.emailService = emailService;
    this.theaterRepository = theaterRepository;
    this.auditLogRepository = auditLogRepository;
  }

  async manualRedeem(bookingId, staffId) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status !== 'paid' && booking.status !== 'confirmed') {
      throw new Error('Booking must be paid or confirmed to redeem');
    }
    
    if (booking.status === 'redeemed') {
      throw new Error('Booking is already redeemed');
    }

    const updatedBooking = await this.bookingRepository.update(bookingId, {
      ...booking,
      status: 'redeemed'
    });

    if (this.auditLogRepository) {
      await this.auditLogRepository.create({
        staffId,
        bookingId,
        action: 'MANUAL_REDEEM'
      });
    }

    return updatedBooking;
  }

  async _sendConfirmationEmail(booking) {
    if (!this.emailService) {
      console.warn('EmailService not initialized in BookingService, skipping confirmation email');
      return;
    }

    try {
      const user = await this.userRepository.findById(booking.userId);
      const showtime = await this.showtimeRepository.findById(booking.showtimeId);
      const movie = await this.movieRepository.findById(showtime.movieId);
      
      let theaterName = 'Cinema Theater';
      if (this.theaterRepository) {
        const theater = await this.theaterRepository.findById(showtime.theaterId);
        if (theater) theaterName = theater.name;
      }

      const templateData = await emailTemplates.getBookingConfirmationTemplate({
        userName: user.name,
        bookingId: booking.id,
        movieTitle: movie.title,
        theaterName: theaterName,
        showDate: showtime.showDate,
        showTime: showtime.showTime,
        seatIds: booking.seatIds,
        totalPrice: booking.totalPrice,
        validationToken: booking.validationToken
      }, 'vi'); // Default to Vietnamese for now

      await this.emailService.sendEmail(
        user.email,
        `Booking Confirmation - ${movie.title}`,  
        templateData.html,
        templateData.attachments
      );
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // We don't want to throw error here as the booking is already confirmed
    }
  }

  async _checkAgeEligibility(userId, showtimeId) {
    if (!this.userRepository || !this.showtimeRepository || !this.movieRepository) {
       console.warn('Repositories missing for age verification in BookingService');
       return; 
    }

    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const showtime = await this.showtimeRepository.findById(showtimeId);
    if (!showtime) throw new Error('Showtime not found');

    const movie = await this.movieRepository.findById(showtime.movieId);
    if (!movie) throw new Error('Movie not found');

    // Rehydrate User domain entity to use domain logic
    const userEntity = new User(
      user.id,
      user.name,
      user.email,
      user.phone,
      user.passwordHash,
      user.dateOfBirth,
      user.loyaltyPoints,
      user.role
    );

    if (!userEntity.canBookMovie(movie.rating)) {
        throw new Error(`User is not old enough to watch this movie (Rated ${movie.rating})`);
    }
  }

  async createBooking(bookingData) {
    // Check age eligibility first
    await this._checkAgeEligibility(bookingData.userId, bookingData.showtimeId);

    // Coupon validation and discount application
    let finalPrice = bookingData.totalPrice;
    let originalPrice = bookingData.totalPrice;
    let discountAmount = 0;
    let appliedCouponCode = null;

    if (bookingData.couponCode && this.couponService) {
        const showtime = await this.showtimeRepository.findById(bookingData.showtimeId);
        const validation = await this.couponService.validateCoupon(bookingData.couponCode, {
            userId: bookingData.userId,
            orderTotal: bookingData.totalPrice,
            movieId: showtime.movieId
        });

        if (validation.isValid) {
            appliedCouponCode = validation.code;
            discountAmount = validation.discountAmount;
            finalPrice = Math.max(0, originalPrice - discountAmount);
            
            // Increment usage
            await this.couponService.incrementUsage(appliedCouponCode);
        }
    }

    // Check for existing held booking to upgrade
    const existingHold = await this.bookingRepository.findPendingBookingByUser(bookingData.userId, bookingData.showtimeId);

    if (existingHold) {
      // Verify all requested seats are available (or held by this user)
      for (const seatId of bookingData.seatIds) {
        const collision = await this.bookingRepository.findCollidingBooking(bookingData.showtimeId, seatId, bookingData.userId);
        if (collision) {
          throw new Error(`Seat ${seatId} is no longer available`);
        }
      }

      const updatedBooking = new Booking(
        existingHold.id,
        bookingData.userId,
        bookingData.showtimeId,
        bookingData.seatIds,
        finalPrice,
        new Date(),
        bookingData.paymentMethod === 'cash' ? 'confirmed' : 'pending',
        bookingData.paymentMethod,
        null, // expiresAt
        originalPrice,
        discountAmount,
        appliedCouponCode
      );
      
      if (updatedBooking.status === 'confirmed') {
        updatedBooking.expiresAt = null;
        if (this.validationService) {
          updatedBooking.validationToken = this.validationService.generateValidationToken(existingHold.id);
        }
      } else {
        updatedBooking.expiresAt = new Date(Date.now() + 15 * 60 * 1000); 
      }

      const result = await this.bookingRepository.update(existingHold.id, updatedBooking);
      
      if (result.status === 'confirmed') {
        await this._sendConfirmationEmail(result);
      }
      
      return result;
    }

    // New booking (fallback)
    // Check collisions first
    for (const seatId of bookingData.seatIds) {
        const collision = await this.bookingRepository.findCollidingBooking(bookingData.showtimeId, seatId, bookingData.userId);
        if (collision) {
          throw new Error(`Seat ${seatId} is no longer available`);
        }
    }

    const booking = new Booking(
      null, // ID will be generated by database
      bookingData.userId,
      bookingData.showtimeId,
      bookingData.seatIds,
      finalPrice,
      new Date(),
      bookingData.paymentMethod === 'cash' ? 'confirmed' : 'pending',
      bookingData.paymentMethod,
      null, // expiresAt
      originalPrice,
      discountAmount,
      appliedCouponCode
    );
    
    if (booking.status === 'pending') {
       booking.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    }

    const result = await this.bookingRepository.create(booking);
    
    if (result.status === 'confirmed') {
      if (this.validationService && !result.validationToken) {
        result.validationToken = this.validationService.generateValidationToken(result.id);
        const updated = await this.bookingRepository.update(result.id, result);
        await this._sendConfirmationEmail(updated);
        return updated;
      }
      await this._sendConfirmationEmail(result);
    }

    return result;
  }

  async holdSeat(userId, showtimeId, seatId) {
    // Check age eligibility first
    await this._checkAgeEligibility(userId, showtimeId);

    // 1. Check if seat is already locked by someone else
    const collision = await this.bookingRepository.findCollidingBooking(showtimeId, seatId, userId);
    if (collision) {
      throw new Error('Seat is already reserved');
    }

    // 2. Find existing active hold for this user
    let booking = await this.bookingRepository.findPendingBookingByUser(userId, showtimeId);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (booking) {
      // Check max seats (e.g. 8)
      if (booking.seatIds.length >= 8) {
        throw new Error('Maximum seat limit reached (8)');
      }
      return await this.bookingRepository.addSeatToBooking(booking.id, seatId, expiresAt);
    } else {
      const newBooking = new Booking(
        null,
        userId,
        showtimeId,
        [seatId],
        0, 
        new Date(),
        'held',
        'momo',
        expiresAt
      );
      return await this.bookingRepository.create(newBooking);
    }
  }

  async releaseSeat(userId, showtimeId, seatId) {
    const booking = await this.bookingRepository.findPendingBookingByUser(userId, showtimeId);
    if (!booking) return null;

    const updatedBooking = await this.bookingRepository.removeSeatFromBooking(booking.id, seatId);
    
    if (updatedBooking && updatedBooking.seatIds.length === 0) {
      await this.bookingRepository.delete(updatedBooking.id);
      return { status: 'deleted' }; 
    }
    
    return updatedBooking;
  }

  async getLockedSeats(showtimeId) {
    return await this.bookingRepository.findLockedSeats(showtimeId);
  }

  async searchBookings(query) {
    // 1. Find users by email or phone
    const users = await this.userRepository.searchByEmailOrPhone(query);
    if (!users || users.length === 0) {
      return [];
    }
    
    const userIds = users.map(user => user.id);
    
    // 2. Find bookings for these users
    return await this.bookingRepository.findByUserIds(userIds);
  }

  async getAllBookings() {
    return await this.bookingRepository.findAll();
  }

  async getBookingById(id) {
    return await this.bookingRepository.findById(id);
  }

  async getBookingsByUserId(userId) {
    return await this.bookingRepository.findByUserId(userId);
  }

  async confirmBooking(id) {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) return null;
    
    // Create updated booking object or partial update
    // Since repository update expects an object with properties
    const updateData = {
        ...booking,
        status: 'confirmed',
        expiresAt: null // Clear expiration
    };

    if (this.validationService && !updateData.validationToken) {
        updateData.validationToken = this.validationService.generateValidationToken(id);
    }
    
    const result = await this.bookingRepository.update(id, updateData);
    if (result && result.status === 'confirmed') {
      await this._sendConfirmationEmail(result);
    }
    return result;
  }

  async validateBooking(token) {
    if (!this.validationService) {
      throw new Error('Validation service not initialized');
    }

    try {
      const decoded = this.validationService.verifyValidationToken(token);
      const bookingId = decoded.bookingId;

      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking) {
        return { status: 'invalid', message: 'Booking not found' };
      }

      // Check if token matches stored token (security measure)
      if (booking.validationToken !== token) {
        return { status: 'invalid', message: 'Token mismatch' };
      }

      // Time-based Validation (Window: -60m to +30m)
      const showtime = await this.showtimeRepository.findById(booking.showtimeId);
      if (!showtime) {
        return { status: 'invalid', message: 'Showtime not found associated with booking' };
      }

      // Construct Showtime DateTime
      // showtime.showDate is assumed to be a Date object or string.
      // showtime.showTime is "HH:MM"
      const showDateTime = new Date(showtime.showDate);
      const [hours, minutes] = showtime.showTime.split(':').map(Number);
      showDateTime.setHours(hours, minutes, 0, 0);

      const now = new Date();
      // Calculate difference in minutes
      const diffMs = now.getTime() - showDateTime.getTime();
      const diffMinutes = diffMs / (1000 * 60);

      // Rule: Valid from 60 mins BEFORE (-60) to 30 mins AFTER (+30)
      if (diffMinutes < -60) {
          return { status: 'invalid', message: 'Ticket not yet valid. (Valid 60 mins before show)' };
      }
      if (diffMinutes > 30) {
          return { status: 'invalid', message: 'Ticket expired. (Valid until 30 mins after show start)' };
      }

      if (booking.status === 'redeemed') {
        return { 
          status: 'redeemed', 
          message: 'Ticket already redeemed',
          booking: {
            id: booking.id,
            seats: booking.seatIds
          }
        };
      }

      if (booking.status !== 'confirmed') {
        return { status: 'invalid', message: `Booking status is ${booking.status}` };
      }

      // Mark as redeemed
      const updateData = {
        ...booking,
        status: 'redeemed'
      };
      await this.bookingRepository.update(bookingId, updateData);

      return {
        status: 'valid',
        booking: {
          id: booking.id,
          seats: booking.seatIds,
          totalPrice: booking.totalPrice
        }
      };
    } catch (error) {
      return { status: 'invalid', message: error.message };
    }
  }

  async cancelBooking(id) {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) return null;

    if (booking.couponCode && this.couponService) {
      await this.couponService.decrementUsage(booking.couponCode);
    }

    const updateData = {
        ...booking,
        status: 'cancelled'
    };

    return await this.bookingRepository.update(id, updateData);
  }
}

module.exports = BookingService;