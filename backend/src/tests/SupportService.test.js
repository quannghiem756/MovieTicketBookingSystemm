const SupportService = require('../application/SupportService');
const emailTemplates = require('../infrastructure/EmailTemplates');

describe('SupportService', () => {
    let supportService;
    let mockSupportTicketRepository;

    beforeEach(() => {
        mockSupportTicketRepository = {
            create: jest.fn(),
            findAllSortedByCreatedAt: jest.fn(),
            findById: jest.fn(),
            update: jest.fn()
        };
        supportService = new SupportService(mockSupportTicketRepository);
    });

    describe('createTicket', () => {
        it('should assign HIGH priority for Payment Issue', async () => {
            const ticketData = {
                name: 'John',
                email: 'john@test.com',
                phone: '123',
                category: 'Payment Issue',
                message: 'Failed payment'
            };

            mockSupportTicketRepository.create.mockImplementation(data => Promise.resolve({ ...data, id: '1' }));

            const result = await supportService.createTicket(ticketData);
            expect(result.priority).toBe('High');
            expect(mockSupportTicketRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                priority: 'High'
            }));
        });

        it('should assign HIGH priority for Ticket/QR Problem', async () => {
            const ticketData = {
                name: 'John',
                email: 'john@test.com',
                phone: '123',
                category: 'Ticket/QR Problem',
                message: 'QR not working'
            };

            mockSupportTicketRepository.create.mockImplementation(data => Promise.resolve({ ...data, id: '1' }));

            const result = await supportService.createTicket(ticketData);
            expect(result.priority).toBe('High');
        });

        it('should assign MEDIUM priority for Account', async () => {
            const ticketData = {
                name: 'John',
                email: 'john@test.com',
                phone: '123',
                category: 'Account',
                message: 'Login problem'
            };

            mockSupportTicketRepository.create.mockImplementation(data => Promise.resolve({ ...data, id: '1' }));

            const result = await supportService.createTicket(ticketData);
            expect(result.priority).toBe('Medium');
        });

        it('should assign LOW priority for General Question', async () => {
            const ticketData = {
                name: 'John',
                email: 'john@test.com',
                phone: '123',
                category: 'General Question',
                message: 'Just asking'
            };

            mockSupportTicketRepository.create.mockImplementation(data => Promise.resolve({ ...data, id: '1' }));

            const result = await supportService.createTicket(ticketData);
            expect(result.priority).toBe('Low');
        });
    });

    describe('getAllTickets', () => {
        it('should call repository to find all tickets sorted', async () => {
            mockSupportTicketRepository.findAllSortedByCreatedAt.mockResolvedValue([]);
            await supportService.getAllTickets();
            expect(mockSupportTicketRepository.findAllSortedByCreatedAt).toHaveBeenCalled();
        });
    });

    describe('addInternalReply', () => {
        let mockTicketCommentRepository;
        let mockEmailService;

        beforeEach(() => {
            mockTicketCommentRepository = {
                create: jest.fn()
            };
            mockEmailService = {
                sendEmail: jest.fn()
            };
            jest.spyOn(emailTemplates, 'getSupportReplyTemplate');
            
            supportService = new SupportService(
                mockSupportTicketRepository,
                mockTicketCommentRepository,
                mockEmailService
            );
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should send email with translated category in Vietnamese', async () => {
            const ticketId = 'ticket123';
            const ticket = {
                _id: ticketId,
                category: 'Payment Issue',
                email: 'user@test.com',
                accessToken: 'token123'
            };
            const content = 'Internal reply content';

            mockSupportTicketRepository.findById.mockResolvedValue(ticket);
            mockTicketCommentRepository.create.mockResolvedValue({ id: 'comment1' });
            mockSupportTicketRepository.update.mockResolvedValue({});
            mockEmailService.sendEmail.mockResolvedValue({});

            await supportService.addInternalReply(ticketId, 'adminId', 'admin', content);

            expect(emailTemplates.getSupportReplyTemplate).toHaveBeenCalledWith(
                expect.objectContaining({
                    subject: 'Vấn đề thanh toán'
                }),
                'vi'
            );
        });

        it('should fallback to original category if translation is missing', async () => {
            const ticketId = 'ticket123';
            const ticket = {
                _id: ticketId,
                category: 'Unknown Category',
                email: 'user@test.com',
                accessToken: 'token123'
            };
            const content = 'Internal reply content';

            mockSupportTicketRepository.findById.mockResolvedValue(ticket);
            mockTicketCommentRepository.create.mockResolvedValue({ id: 'comment1' });
            mockSupportTicketRepository.update.mockResolvedValue({});
            mockEmailService.sendEmail.mockResolvedValue({});

            await supportService.addInternalReply(ticketId, 'adminId', 'admin', content);

            expect(emailTemplates.getSupportReplyTemplate).toHaveBeenCalledWith(
                expect.objectContaining({
                    subject: 'Unknown Category'
                }),
                'vi'
            );
        });
    });

    describe('Constants', () => {
        it('should have CATEGORY_TRANSLATIONS defined', () => {
            expect(SupportService.CATEGORY_TRANSLATIONS).toBeDefined();
            expect(SupportService.CATEGORY_TRANSLATIONS['Payment Issue']).toBe('Vấn đề thanh toán');
            expect(SupportService.CATEGORY_TRANSLATIONS['Ticket/QR Problem']).toBe('Vấn đề vé/QR');
            expect(SupportService.CATEGORY_TRANSLATIONS['Account']).toBe('Tài khoản');
            expect(SupportService.CATEGORY_TRANSLATIONS['General Question']).toBe('Câu hỏi chung');
        });
    });
});
