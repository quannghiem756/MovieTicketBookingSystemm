const BookingService = require('../application/BookingService');

describe('BookingService Search', () => {
    let bookingService;
    let mockBookingRepository;
    let mockUserRepository;

    beforeEach(() => {
        mockBookingRepository = {
            findByUserIds: jest.fn()
        };
        mockUserRepository = {
            searchByEmailOrPhone: jest.fn()
        };
        // Mock other dependencies as null or empty objects since we only test search
        bookingService = new BookingService(
            mockBookingRepository,
            mockUserRepository,
            {}, {}, {}, {}, {}, {}
        );
    });

    it('should search users and then find bookings for those users', async () => {
        const query = 'john@example.com';
        const mockUsers = [{ id: 'user1' }];
        const mockBookings = [{ id: 'booking1', bookingDate: new Date() }];

        mockUserRepository.searchByEmailOrPhone.mockResolvedValue(mockUsers);
        mockBookingRepository.findByUserIds.mockResolvedValue(mockBookings);

        const result = await bookingService.searchBookings(query);

        expect(mockUserRepository.searchByEmailOrPhone).toHaveBeenCalledWith(query);
        expect(mockBookingRepository.findByUserIds).toHaveBeenCalledWith(['user1']);
        expect(result).toEqual(mockBookings);
    });

    it('should return empty array if no users found', async () => {
        mockUserRepository.searchByEmailOrPhone.mockResolvedValue([]);
        const result = await bookingService.searchBookings('unknown');
        expect(result).toEqual([]);
        expect(mockBookingRepository.findByUserIds).not.toHaveBeenCalled();
    });
});
