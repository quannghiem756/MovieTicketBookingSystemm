const QRCode = require('qrcode');

class EmailTemplates {
  /**
   * Generates an HTML email template for booking confirmation.
   * @param {Object} booking - Booking details
   * @param {string} booking.userName
   * @param {string} booking.bookingId
   * @param {string} booking.movieTitle
   * @param {string} booking.theaterName
   * @param {Date|string} booking.showDate
   * @param {string} booking.showTime
   * @param {string[]} booking.seatIds
   * @param {string|number} booking.totalPrice
   * @returns {Promise<string>} HTML content
   */
  async getBookingConfirmationTemplate(booking) {
    // Generate QR Code as Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(booking.bookingId);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #1e1e1e; border-radius: 16px; overflow: hidden; border: 1px solid #333; }
          .header { background: linear-gradient(90deg, #e53935 0%, #b71c1c 100%); padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 1px; }
          .content { padding: 30px; }
          .greeting { font-size: 18px; margin-bottom: 20px; }
          .movie-card { background-color: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid #444; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
          .movie-title { font-size: 24px; font-weight: 700; color: #e53935; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px; }
          .info-table { width: 100%; border-collapse: collapse; }
          .info-table td { padding: 8px 0; vertical-align: top; }
          .info-label { color: #aaaaaa; width: 100px; font-size: 14px; }
          .info-value { color: #ffffff; font-weight: 600; font-size: 16px; }
          .total-row .info-value { color: #e53935; font-size: 20px; }
          .qr-section { text-align: center; padding: 25px; background-color: rgba(229, 57, 53, 0.1); border-radius: 12px; margin-top: 20px; border: 1px dashed #e53935; }
          .qr-code { background-color: white; padding: 15px; border-radius: 8px; display: inline-block; margin: 15px 0; }
          .booking-id { font-family: monospace; font-size: 16px; background: #333; padding: 5px 10px; border-radius: 4px; display: inline-block; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #333; margin-top: 20px; }
          .btn { display: inline-block; background-color: #e53935; color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p class="greeting">Hi ${booking.userName || 'Movie Fan'},</p>
            <p>Your ticket has been successfully booked. Get ready for showtime!</p>
            
            <div class="movie-card">
              <div class="movie-title">${booking.movieTitle}</div>
              <table class="info-table">
                <tr>
                  <td class="info-label">Theater:</td>
                  <td class="info-value">${booking.theaterName}</td>
                </tr>
                <tr>
                  <td class="info-label">Date:</td>
                  <td class="info-value">${new Date(booking.showDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td class="info-label">Time:</td>
                  <td class="info-value">${booking.showTime}</td>
                </tr>
                <tr>
                  <td class="info-label">Seats:</td>
                  <td class="info-value">${Array.isArray(booking.seatIds) ? booking.seatIds.join(', ') : booking.seatIds}</td>
                </tr>
                <tr class="total-row">
                  <td class="info-label">Total:</td>
                  <td class="info-value">${booking.totalPrice}</td>
                </tr>
              </table>
            </div>

            <div class="qr-section">
              <p style="margin: 0; color: #cccccc; font-size: 14px;">Scan this QR code at the cinema entrance</p>
              <div class="qr-code">
                <img src="${qrCodeDataUrl}" width="150" height="150" alt="Ticket QR Code" />
              </div>
              <div>
                <span class="booking-id">ID: ${booking.bookingId}</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings/${booking.bookingId}" class="btn">View Booking Details</a>
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Movie Ticket Booking System.<br/>
            This is an automated message, please do not reply.
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailTemplates();
