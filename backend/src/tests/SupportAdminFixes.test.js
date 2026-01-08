const SupportService = require('../application/SupportService');

describe('SupportService Admin Fixes', () => {
    let supportService;
    let mockSupportTicketRepository;
    let mockTicketCommentRepository;

    beforeEach(() => {
        mockSupportTicketRepository = {
            findById: jest.fn(),
            update: jest.fn()
        };
        mockTicketCommentRepository = {
            findByTicketId: jest.fn()
        };
        supportService = new SupportService(mockSupportTicketRepository, mockTicketCommentRepository);
    });

    describe('getTicketById', () => {
        it('should return ticket and its comments', async () => {
            const ticketId = 'ticket123';
            const mockTicket = { _id: ticketId, subject: 'Help' };
            const mockComments = [{ content: 'Reply 1' }, { content: 'Reply 2' }];

            mockSupportTicketRepository.findById.mockResolvedValue(mockTicket);
            mockTicketCommentRepository.findByTicketId.mockResolvedValue(mockComments);

            const result = await supportService.getTicketById(ticketId);

            expect(mockSupportTicketRepository.findById).toHaveBeenCalledWith(ticketId);
            expect(mockTicketCommentRepository.findByTicketId).toHaveBeenCalledWith(ticketId);
            expect(result).toEqual({ ticket: mockTicket, comments: mockComments });
        });

        it('should throw error if ticket not found', async () => {
            mockSupportTicketRepository.findById.mockResolvedValue(null);
            await expect(supportService.getTicketById('invalid')).rejects.toThrow('Ticket not found');
        });
    });

    describe('updateTicketStatus', () => {
        it('should update ticket status', async () => {
            const ticketId = 'ticket123';
            const newStatus = 'Resolved';
            const mockTicket = { _id: ticketId, status: 'Open' };

            mockSupportTicketRepository.findById.mockResolvedValue(mockTicket);
            mockSupportTicketRepository.update.mockResolvedValue({ ...mockTicket, status: newStatus });

            const result = await supportService.updateTicketStatus(ticketId, newStatus);

            expect(mockSupportTicketRepository.findById).toHaveBeenCalledWith(ticketId);
            expect(mockSupportTicketRepository.update).toHaveBeenCalledWith(ticketId, { status: newStatus });
            expect(result.status).toBe(newStatus);
        });
    });
});
