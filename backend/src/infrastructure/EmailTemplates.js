const QRCode = require('qrcode');

const translations = {
  en: {
    title: 'Booking Confirmed!',
    subtitle: 'Your ticket has been successfully booked. Get ready for showtime!',
    movieTitle: 'Movie',
    theater: 'Theater',
    date: 'Date',
    time: 'Time',
    seats: 'Seats',
    total: 'Total',
    bookingId: 'Booking ID',
    bookingDate: 'Booking Date',
    qrTitle: 'Scan this QR code at the cinema entrance',
    viewDetails: 'View Booking Details',
    footer: 'Movie Ticket Booking System',
    automated: 'This is an automated message, please do not reply.'
  },
  vi: {
    title: 'Đặt vé thành công!',
    subtitle: 'Vé của bạn đã được đặt thành công. Chúc bạn xem phim vui vẻ!',
    movieTitle: 'Phim',
    theater: 'Rạp',
    date: 'Ngày',
    time: 'Giờ',
    seats: 'Ghế',
    total: 'Tổng tiền',
    bookingId: 'Mã đặt vé',
    bookingDate: 'Ngày đặt',
    qrTitle: 'Quét mã QR này tại lối vào rạp',
    viewDetails: 'Xem chi tiết vé',
    footer: 'Hệ thống đặt vé xem phim',
    automated: 'Đây là tin nhắn tự động, vui lòng không trả lời.'
  }
};

class EmailTemplates {
  /**
   * Generates an HTML email template for booking confirmation.
   * @param {Object} booking - Booking details
   * @param {string} lang - Language code ('en' or 'vi')
   * @returns {Promise<string>} HTML content
   */
  async getBookingConfirmationTemplate(booking, lang = 'en') {
    const t = translations[lang] || translations.en;
    
    // Generate QR Code as Data URL
    // Use validationToken for the QR code value to match frontend
    const validationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/bookings/validate?token=${booking.validationToken}`;
    const qrCodeDataUrl = await QRCode.toDataURL(validationUrl);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${t.title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #1e1e1e; border-radius: 16px; overflow: hidden; border: 1px solid #333; }
          .header { padding: 40px 20px 20px; text-align: center; }
          .check-icon { font-size: 60px; color: #4caf50; display: block; margin-bottom: 20px; text-decoration: none; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 800; background: linear-gradient(90deg, #ffffff 0%, #b3b3b3 100%); -webkit-background-clip: text; color: #ffffff; letter-spacing: 1px; }
          .subtitle { color: #aaaaaa; margin-top: 10px; font-size: 16px; }
          .content { padding: 30px; }
          .card { background-color: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 20px; border: 1px solid #444; }
          .movie-title { font-size: 24px; font-weight: 700; color: #e53935; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px; }
          .info-table { width: 100%; border-collapse: collapse; }
          .info-table td { padding: 8px 0; vertical-align: top; }
          .info-label { color: #aaaaaa; width: 120px; font-size: 14px; }
          .info-value { color: #ffffff; font-weight: 600; font-size: 16px; }
          .total-row .info-value { color: #e53935; font-size: 20px; }
          .qr-section { text-align: center; padding: 25px; background-color: rgba(229, 57, 53, 0.1); border-radius: 12px; margin-top: 20px; border: 1px dashed #e53935; }
          .qr-code { background-color: white; padding: 10px; border-radius: 8px; display: inline-block; margin: 15px 0; }
          .booking-id-chip { font-family: monospace; font-size: 16px; background: #333; padding: 8px 16px; border-radius: 16px; display: inline-block; border: 1px solid #555; }
          .btn { display: inline-block; background-color: #e53935; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #333; margin-top: 20px; background-color: #181818; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="check-icon">&#10004;</div>
            <h1>${t.title}</h1>
            <div class="subtitle">${t.subtitle}</div>
          </div>
          
          <div class="content">
            <!-- Movie Details Card -->
            <div class="card">
              <div class="movie-title">${booking.movieTitle}</div>
              <table class="info-table">
                <tr>
                  <td class="info-label">${t.theater}:</td>
                  <td class="info-value">${booking.theaterName}</td>
                </tr>
                <tr>
                  <td class="info-label">${t.date}:</td>
                  <td class="info-value">${new Date(booking.showDate).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td class="info-label">${t.time}:</td>
                  <td class="info-value">${booking.showTime}</td>
                </tr>
                <tr>
                  <td class="info-label">${t.seats}:</td>
                  <td class="info-value">${Array.isArray(booking.seatIds) ? booking.seatIds.join(', ') : booking.seatIds}</td>
                </tr>
                <tr class="total-row">
                  <td class="info-label">${t.total}:</td>
                  <td class="info-value">${typeof booking.totalPrice === 'number' ? booking.totalPrice.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US') + (lang === 'vi' ? ' ₫' : '') : booking.totalPrice}</td>
                </tr>
              </table>
            </div>

            <!-- Booking Info & QR Card -->
            <div class="card" style="text-align: center;">
              <div style="margin-bottom: 20px;">
                <div style="color: #aaaaaa; font-size: 12px; margin-bottom: 5px;">${t.bookingId}</div>
                <span class="booking-id-chip">${booking.bookingId}</span>
              </div>

              <div class="qr-section">
                <p style="margin: 0; color: #cccccc; font-size: 14px;">${t.qrTitle}</p>
                <div class="qr-code">
                  <img src="${qrCodeDataUrl}" width="150" height="150" alt="Ticket QR Code" />
                </div>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings/${booking.bookingId}" class="btn">${t.viewDetails}</a>
            </div>
          </div>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} ${t.footer}.<br/>
            ${t.automated}
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailTemplates();
