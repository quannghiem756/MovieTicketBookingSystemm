const BookingService = require('../application/BookingService');

describe('BookingService Manual Redeem', () => {
    let bookingService;
    let mockBookingRepository;
    let mockAuditLogRepository;

    beforeEach(() => {
        mockBookingRepository = {
            findById: jest.fn(),
            update: jest.fn()
        };
        mockAuditLogRepository = {
            create: jest.fn()
        };
        
        bookingService = new BookingService(
            mockBookingRepository,
            {}, {}, {}, {}, {}, {}, {}
        );
        // Manually inject for test as we haven't updated constructor yet
        bookingService.auditLogRepository = mockAuditLogRepository;
    });

    it('should manually redeem a paid booking and log it', async () => {
        const bookingId = 'booking1';
        const staffId = 'staff1';
        // 'paid' or 'confirmed' should be redeemable? Spec says "Paid". 
        // In this system 'confirmed' usually means paid (via cash or online). 
        // BookingModel has 'paid' status but default 'confirmed' for cash.
        // I will assume 'confirmed' or 'paid'.
        const booking = { id: bookingId, status: 'confirmed', userId: 'user1' };

        mockBookingRepository.findById.mockResolvedValue(booking);
        mockBookingRepository.update.mockImplementation((id, data) => Promise.resolve({ ...booking, ...data }));

        const result = await bookingService.manualRedeem(bookingId, staffId);

        expect(result.status).toBe('redeemed');
        expect(mockBookingRepository.update).toHaveBeenCalledWith(bookingId, expect.objectContaining({ status: 'redeemed' }));
        expect(mockAuditLogRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            staffId,
            bookingId,
            action: 'MANUAL_REDEEM'
        }));
    });

    it('should throw error if booking is not paid/confirmed', async () => {
        const bookingId = 'booking1';
        const staffId = 'staff1';
        const booking = { id: bookingId, status: 'pending' };

        mockBookingRepository.findById.mockResolvedValue(booking);

        await expect(bookingService.manualRedeem(bookingId, staffId))
            .rejects
            .toThrow('Booking must be paid or confirmed to redeem');
    });
});
