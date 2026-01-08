const SupportService = require('../application/SupportService');

describe('SupportService Public Access', () => {
    let supportService;
    let mockSupportTicketRepository;
    let mockTicketCommentRepository;

    beforeEach(() => {
        mockSupportTicketRepository = {
            findByAccessToken: jest.fn(),
            create: jest.fn(),
            findAllSortedByCreatedAt: jest.fn()
        };
        mockTicketCommentRepository = {
            findByTicketId: jest.fn()
        };
        supportService = new SupportService(mockSupportTicketRepository, mockTicketCommentRepository);
    });

    it('should return ticket and comments for valid token', async () => {
        const token = 'valid-token';
        const mockTicket = { _id: 'ticket1', accessToken: token, subject: 'Issue' };
        const mockComments = [{ content: 'Reply' }];

        mockSupportTicketRepository.findByAccessToken.mockResolvedValue(mockTicket);
        mockTicketCommentRepository.findByTicketId.mockResolvedValue(mockComments);

        const result = await supportService.getTicketByToken(token);

        expect(mockSupportTicketRepository.findByAccessToken).toHaveBeenCalledWith(token);
        expect(mockTicketCommentRepository.findByTicketId).toHaveBeenCalledWith('ticket1');
        expect(result).toEqual({ ticket: mockTicket, comments: mockComments });
    });

    it('should throw error if ticket not found', async () => {
        mockSupportTicketRepository.findByAccessToken.mockResolvedValue(null);

        await expect(supportService.getTicketByToken('invalid')).rejects.toThrow('Ticket not found');
    });
});
