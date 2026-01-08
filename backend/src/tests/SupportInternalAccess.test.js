const SupportService = require('../application/SupportService');

describe('SupportService Internal Access', () => {
    let supportService;
    let mockSupportTicketRepository;
    let mockTicketCommentRepository;

    beforeEach(() => {
        mockSupportTicketRepository = {
            findById: jest.fn(),
            update: jest.fn()
        };
        mockTicketCommentRepository = {
            create: jest.fn()
        };
        supportService = new SupportService(mockSupportTicketRepository, mockTicketCommentRepository);
    });

    it('should create an internal comment and update ticket status to Replied', async () => {
        const ticketId = 'ticket1';
        const staffId = 'staff1';
        const staffRole = 'Staff';
        const replyContent = 'Staff reply';
        const mockTicket = { _id: ticketId, status: 'Open' };

        mockSupportTicketRepository.findById.mockResolvedValue(mockTicket);
        mockTicketCommentRepository.create.mockResolvedValue({ content: replyContent });
        mockSupportTicketRepository.update.mockResolvedValue({ ...mockTicket, status: 'Replied' });

        const result = await supportService.addInternalReply(ticketId, staffId, staffRole, replyContent);

        expect(mockSupportTicketRepository.findById).toHaveBeenCalledWith(ticketId);
        expect(mockTicketCommentRepository.create).toHaveBeenCalledWith({
            ticketId,
            senderId: staffId,
            senderRole: staffRole,
            content: replyContent
        });
        expect(mockSupportTicketRepository.update).toHaveBeenCalledWith(ticketId, { status: 'Replied' });
        expect(result).toEqual({ content: replyContent });
    });

    it('should throw error if ticket not found for internal reply', async () => {
        mockSupportTicketRepository.findById.mockResolvedValue(null);

        await expect(supportService.addInternalReply('invalid', 'staff1', 'Staff', 'Hi')).rejects.toThrow('Ticket not found');
    });
});
