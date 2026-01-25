const QRCode = require('qrcode');

const translations = {
  en: {
    title: 'Booking Confirmed!',
    greeting: 'Hi',
    subtitle: 'Your ticket has been successfully booked. Get ready for showtime!',
    movieTitle: 'Movie',
    theater: 'Theater',
    date: 'Date',
    time: 'Time',
    seats: 'Seats',
    total: 'Total',
    bookingId: 'Booking ID',
    qrTitle: 'Scan this QR code at the cinema entrance',
    viewDetails: 'View Booking Details',
    supportTitle: 'New Reply to Your Support Ticket',
    supportGreeting: 'Hello',
    supportSubtitle: 'A member of our team has replied to your support ticket.',
    ticketSubject: 'Subject',
    viewTicket: 'View Ticket & Reply',
    viewTicketMobile: 'Open in Mobile App',
    footer: 'Movie Ticket Booking System',
    automated: 'This is an automated message, please do not reply.'
  },
  vi: {
    title: 'Đặt vé thành công!',
    greeting: 'Chào',
    subtitle: 'Vé của bạn đã được đặt thành công. Chúc bạn xem phim vui vẻ!',
    movieTitle: 'Phim',
    theater: 'Rạp',
    date: 'Ngày',
    time: 'Giờ',
    seats: 'Ghế',
    total: 'Tổng tiền',
    bookingId: 'Mã đặt vé',
    qrTitle: 'Quét mã QR này tại lối vào rạp',
    viewDetails: 'Xem chi tiết vé',
    supportTitle: 'Phản hồi mới cho yêu cầu hỗ trợ của bạn',
    supportGreeting: 'Xin chào',
    supportSubtitle: 'Đội ngũ hỗ trợ của chúng tôi đã phản hồi yêu cầu của bạn.',
    ticketSubject: 'Tiêu đề',
    viewTicket: 'Xem yêu cầu và Phản hồi',
    viewTicketMobile: 'Mở trong ứng dụng',
    footer: 'Hệ thống đặt vé xem phim',
    automated: 'Đây là tin nhắn tự động, vui lòng không trả lời.'
  }
};

class EmailTemplates {
  /**
   * Generates an HTML email template for support ticket reply notification.
   * @param {Object} data - Ticket and reply details
   * @param {string} lang - Language code ('en' or 'vi')
   * @returns {Object} { html }
   */
  getSupportReplyTemplate(data, lang = 'en') {
    const t = translations[lang] || translations.en;
    const ticketUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/support/ticket/${data.accessToken}`;
    const mobileTicketUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/support/mobile-launch/${data.accessToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${t.supportTitle}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; color: #333333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { background-color: #e53935; padding: 20px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
          .reply-preview { background-color: #f9f9f9; border-left: 4px solid #e53935; padding: 15px; margin: 20px 0; font-style: italic; }
          .ticket-info { margin-bottom: 20px; font-size: 14px; color: #666; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; background-color: #f4f4f4; }
          .btn { display: inline-block; background-color: #e53935; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; margin-right: 10px; }
          .btn-mobile { background-color: #333333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${t.supportTitle}</h1>
          </div>
          <div class="content">
            <p class="greeting">${t.supportGreeting},</p>
            <p>${t.supportSubtitle}</p>
            
            <div class="ticket-info">
              <strong>${t.ticketSubject}:</strong> ${data.subject}
            </div>

            <div class="reply-preview">
              "${data.replyContent.length > 200 ? data.replyContent.substring(0, 200) + '...' : data.replyContent}"
            </div>
            
            <div style="text-align: center;">
              <a href="${ticketUrl}" class="btn">${t.viewTicket}</a>
              <a href="${mobileTicketUrl}" class="btn btn-mobile">${t.viewTicketMobile}</a>
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

    return { html };
  }

  /**
   * Generates an HTML email template for booking confirmation.
   * @param {Object} booking - Booking details
   * @param {string} lang - Language code ('en' or 'vi')
   * @returns {Promise<Object>} { html, attachments }
   */
  async getBookingConfirmationTemplate(booking, lang = 'en') {
    const t = translations[lang] || translations.en;
    
    // Generate QR Code as Buffer for attachment
    const validationUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/bookings/validate?token=${booking.validationToken}`;
    // Using toDataURL for buffer creation via splitting base64 string or using toBuffer if available
    // QRCode.toBuffer is available in node-qrcode
    const qrCodeBuffer = await QRCode.toBuffer(validationUrl);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${t.title}</title>
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
            <h1>${t.title}</h1>
          </div>
          <div class="content">
            <p class="greeting">${t.greeting} ${booking.userName || (lang === 'vi' ? 'Bạn' : 'Movie Fan')},</p>
            <p>${t.subtitle}</p>
            
            <div class="movie-card">
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

            <div class="qr-section">
              <p style="margin: 0; color: #cccccc; font-size: 14px;">${t.qrTitle}</p>
              <div class="qr-code">
                <img src="cid:qrCodeImage" width="150" height="150" alt="Ticket QR Code" />
              </div>
              <div>
                <span class="booking-id">${t.bookingId}: ${booking.bookingId}</span>
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

    return {
      html,
      attachments: [{
        filename: 'qrcode.png',
        content: qrCodeBuffer,
        cid: 'qrCodeImage' // same cid value as in the html img src
      }]
    };
  }
}

module.exports = new EmailTemplates();
