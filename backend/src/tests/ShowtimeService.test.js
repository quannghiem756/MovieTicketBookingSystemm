const ShowtimeService = require('../application/ShowtimeService');
const Showtime = require('../domain/Showtime');

describe('ShowtimeService', () => {
  let showtimeService;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByMovieId: jest.fn(),
      findFutureByMovieId: jest.fn(),
      findByDateAndTheater: jest.fn(),
      findByDate: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    showtimeService = new ShowtimeService(mockRepository);
  });

  describe('getShowtimeStatus', () => {
    // Helper to create a showtime object
    const createShowtime = (dateStr, timeStr) => {
      return new Showtime(
        '1',
        'movie1',
        'theater1',
        new Date(dateStr),
        timeStr,
        '2D',
        'English',
        100
      );
    };

    it('should return "Active" if showtime is more than 15 minutes away', () => {
        // Mock current time: 2023-10-27 10:00:00
        const now = new Date('2023-10-27T10:00:00.000Z');
        // Showtime: 2023-10-27 10:30:00 (30 mins away)
        const showtime = createShowtime('2023-10-27T00:00:00.000Z', '10:30');
        
        const status = showtimeService.getShowtimeStatus(showtime, now);
        expect(status).toBe('Active');
    });

    it('should return "Closed" if showtime is within 15 minutes', () => {
        // Mock current time: 2023-10-27 10:16:00
        const now = new Date('2023-10-27T10:16:00.000Z');
        // Showtime: 2023-10-27 10:30:00 (14 mins away)
        const showtime = createShowtime('2023-10-27T00:00:00.000Z', '10:30');
        
        const status = showtimeService.getShowtimeStatus(showtime, now);
        expect(status).toBe('Closed');
    });

    it('should return "Past" if showtime has started', () => {
        // Mock current time: 2023-10-27 10:30:00
        const now = new Date('2023-10-27T10:30:00.000Z');
        // Showtime: 2023-10-27 10:30:00 (Starts now)
        const showtime = createShowtime('2023-10-27T00:00:00.000Z', '10:30');
        
        const status = showtimeService.getShowtimeStatus(showtime, now);
        expect(status).toBe('Past');
    });

    it('should return "Past" if showtime was yesterday', () => {
        // Mock current time: 2023-10-28 10:00:00
        const now = new Date('2023-10-28T10:00:00.000Z');
        // Showtime: 2023-10-27 10:30:00
        const showtime = createShowtime('2023-10-27T00:00:00.000Z', '10:30');
        
        const status = showtimeService.getShowtimeStatus(showtime, now);
        expect(status).toBe('Past');
    });

     it('should return "Active" if showtime is tomorrow', () => {
        // Mock current time: 2023-10-26 10:00:00
        const now = new Date('2023-10-26T10:00:00.000Z');
        // Showtime: 2023-10-27 10:30:00
        const showtime = createShowtime('2023-10-27T00:00:00.000Z', '10:30');
        
        const status = showtimeService.getShowtimeStatus(showtime, now);
        expect(status).toBe('Active');
    });
  });
});
