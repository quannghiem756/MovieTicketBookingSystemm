const emailTemplates = require('../infrastructure/EmailTemplates');
const QRCode = require('qrcode');

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
}));

describe('EmailTemplates', () => {
  describe('getBookingConfirmationTemplate', () => {
    it('should generate an HTML template with booking details', async () => {
      const booking = {
        userName: 'John Doe',
        bookingId: 'BK123456',
        movieTitle: 'Avengers: Endgame',
        theaterName: 'Marvel Cinema',
        showDate: '2026-01-10',
        showTime: '18:00',
        seatIds: ['A1', 'A2'],
        totalPrice: 200000,
        validationToken: 'valid-token'
      };

      const html = await emailTemplates.getBookingConfirmationTemplate(booking);

      expect(html).toContain('BK123456');
      expect(html).toContain('Avengers: Endgame');
      expect(html).toContain('Marvel Cinema');
      expect(html).toContain('A1, A2');
      expect(html).toContain('200,000'); // Formatting might vary, checking number
      expect(html).toContain('data:image/png;base64,mock-qr-code');
      expect(QRCode.toDataURL).toHaveBeenCalledWith(expect.stringContaining('valid-token'));
    });

    it('should generate Vietnamese template when lang is vi', async () => {
      const booking = {
        bookingId: 'BK123456',
        movieTitle: 'Avengers: Endgame',
        theaterName: 'Marvel Cinema',
        showDate: '2026-01-10',
        showTime: '18:00',
        seatIds: ['A1'],
        totalPrice: 100000,
        validationToken: 'valid-token'
      };

      const html = await emailTemplates.getBookingConfirmationTemplate(booking, 'vi');

      expect(html).toContain('Đặt vé thành công!');
      expect(html).toContain('Tổng tiền');
      expect(html).toContain('Rạp');
      expect(html).toContain('Mã đặt vé');
    });
  });
});
