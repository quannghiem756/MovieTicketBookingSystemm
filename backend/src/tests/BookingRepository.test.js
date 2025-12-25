const MongoBookingRepository = require('../infrastructure/repositories/MongoBookingRepository');
const BookingModel = require('../infrastructure/BookingModel');

// Mock BookingModel
jest.mock('../infrastructure/BookingModel');

describe('MongoBookingRepository', () => {
  let repository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new MongoBookingRepository();
  });

  describe('findByUserId', () => {
    it('should handle bookings with missing movie references gracefully', async () => {
      // Simulate a booking where the showtime's movie is null (deleted)
      const mockBookings = [
        {
          _id: 'booking1',
          userId: 'user1',
          showtimeId: {
            _id: 'showtime1',
            showDate: new Date(),
            showTime: '10:00',
            movieId: null, // Deleted movie
            theaterId: {
              _id: 'theater1',
              name: 'Theater 1'
            }
          }
        }
      ];

      // Mock chain: find().populate()
      const mockPopulate = jest.fn().mockResolvedValue(mockBookings);
      BookingModel.find.mockReturnValue({ populate: mockPopulate });

      // This should NOT throw an error
      const result = await repository.findByUserId('user1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('booking1');
      // Expect movie to be null or a placeholder
      expect(result[0].movie).toBeNull(); 
    });

    it('should handle bookings with missing showtime references gracefully', async () => {
      // Simulate a booking where the showtime is null (deleted)
      const mockBookings = [
        {
          _id: 'booking2',
          userId: 'user1',
          showtimeId: null // Deleted showtime
        }
      ];

      const mockPopulate = jest.fn().mockResolvedValue(mockBookings);
      BookingModel.find.mockReturnValue({ populate: mockPopulate });

      const result = await repository.findByUserId('user1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('booking2');
      expect(result[0].showtime).toBeNull();
    });
  });
});
