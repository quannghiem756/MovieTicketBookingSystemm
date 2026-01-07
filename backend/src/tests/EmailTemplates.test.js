const emailTemplates = require('../infrastructure/EmailTemplates');
const QRCode = require('qrcode');

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code'),
  toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-qr-buffer'))
}));

describe('EmailTemplates', () => {
  describe('getBookingConfirmationTemplate', () => {
    it('should generate an HTML template with booking details and attachment', async () => {
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

      const result = await emailTemplates.getBookingConfirmationTemplate(booking);
      
      expect(result).toHaveProperty('html');
      expect(result).toHaveProperty('attachments');
      expect(result.attachments).toHaveLength(1);
      
      const html = result.html;
      const attachment = result.attachments[0];

      expect(html).toContain('BK123456');
      expect(html).toContain('Avengers: Endgame');
      expect(html).toContain('Marvel Cinema');
      expect(html).toContain('A1, A2');
      expect(html).toContain('200,000'); 
      expect(html).toContain('cid:qrCodeImage');
      
      expect(attachment).toHaveProperty('filename', 'qrcode.png');
      expect(attachment).toHaveProperty('cid', 'qrCodeImage');
      expect(attachment).toHaveProperty('content');
      
      expect(QRCode.toBuffer).toHaveBeenCalledWith(expect.stringContaining('valid-token'));
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

      const result = await emailTemplates.getBookingConfirmationTemplate(booking, 'vi');
      const html = result.html;

      expect(html).toContain('Đặt vé thành công!');
      expect(html).toContain('Tổng tiền');
      expect(html).toContain('Rạp');
      expect(html).toContain('Mã đặt vé');
    });
  });
});
