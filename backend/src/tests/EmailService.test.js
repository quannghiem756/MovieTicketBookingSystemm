const nodemailer = require('nodemailer');

// Define mocks outside to use in factory and tests
// Must start with 'mock' to be used in jest.mock factory
const mockSendMail = jest.fn();
const mockVerify = jest.fn();

// Mock nodemailer with factory
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
    verify: mockVerify
  }))
}));

// Require service AFTER mocking
const EmailService = require('../infrastructure/EmailService');

describe('EmailService', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Default success behavior
    mockSendMail.mockResolvedValue({ messageId: 'test-id' });
    mockVerify.mockResolvedValue(true);
  });

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const html = '<p>Test Body</p>';

      const result = await EmailService.sendEmail(to, subject, html);

      expect(mockSendMail).toHaveBeenCalledWith(expect.objectContaining({
        to,
        subject,
        html,
      }));
      expect(result).toEqual({ messageId: 'test-id' });
    });

    it('should throw an error if sending fails', async () => {
      const error = new Error('Sending failed');
      mockSendMail.mockRejectedValue(error);

      await expect(EmailService.sendEmail('to', 'sub', 'body')).rejects.toThrow('Sending failed');
    });
  });

  describe('verifyConnection', () => {
    it('should verify connection successfully', async () => {
      const result = await EmailService.verifyConnection();
      expect(result).toBe(true);
      expect(mockVerify).toHaveBeenCalled();
    });

    it('should return false if verification fails', async () => {
        mockVerify.mockRejectedValue(new Error('Connection failed'));
        const result = await EmailService.verifyConnection();
        expect(result).toBe(false);
    });
  });
});
