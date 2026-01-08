const SupportService = require('../application/SupportService');

describe('SupportService Email Notification', () => {
  let supportService;
  let mockSupportTicketRepository;
  let mockTicketCommentRepository;
  let mockEmailService;

  beforeEach(() => {
    mockSupportTicketRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      findByAccessToken: jest.fn()
    };
    mockTicketCommentRepository = {
      create: jest.fn()
    };
    mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue({ messageId: 'test-msg-id' })
    };

    supportService = new SupportService(
      mockSupportTicketRepository,
      mockTicketCommentRepository,
      mockEmailService
    );
  });

  it('should send an email notification when an internal reply is added', async () => {
    const ticketId = 'ticket123';
    const senderId = 'staff456';
    const senderRole = 'Staff';
    const content = 'Your issue has been resolved.';
    const ticket = {
      _id: ticketId,
      email: 'user@example.com',
      subject: 'Issue with payment',
      accessToken: 'token123'
    };

    mockSupportTicketRepository.findById.mockResolvedValue(ticket);
    mockTicketCommentRepository.create.mockResolvedValue({ _id: 'comment789', content });

    await supportService.addInternalReply(ticketId, senderId, senderRole, content);

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      ticket.email,
      'New Reply to Your Support Ticket',
      expect.stringContaining('Your issue has been resolved.')
    );
  });
});
