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

  describe('getFutureShowtimesByMovieId', () => {
      it('should filter out past showtimes', async () => {
          const pastDate = new Date();
          pastDate.setHours(pastDate.getHours() - 2); // 2 hours ago
          const futureDate = new Date();
          futureDate.setHours(futureDate.getHours() + 2); // 2 hours future

          const pastShowtime = new Showtime('1', 'm1', 't1', pastDate, '10:00'); // Date object is usually set to start of day, but let's assume...
          // Wait, getShowtimeStatus logic depends on showDate + showTime.
          // To reliably make it "Past", I need to align showDate and showTime.
          
          // Let's use strict strings.
          const today = new Date();
          const y = today.getUTCFullYear();
          const m = String(today.getUTCMonth() + 1).padStart(2, '0');
          const d = String(today.getUTCDate()).padStart(2, '0');
          const todayStr = `${y}-${m}-${d}T00:00:00.000Z`;
          
          const now = new Date();
          const currentHour = now.getUTCHours();
          
          // Past: 2 hours ago
          let pastHour = currentHour - 2;
          if (pastHour < 0) pastHour += 24; // Simplify: just assume test runs mid-day or handle date shift.
          // Easier: Use a fixed "now" by mocking Date, but I can't easily mock Date globally without setup.
          
          // Alternative: Use showDate of Yesterday for Past.
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          const pastShowtimeObj = new Showtime('1', 'm1', 't1', yesterday, '10:00');
          const futureShowtimeObj = new Showtime('2', 'm1', 't1', tomorrow, '10:00');

          mockRepository.findFutureByMovieId.mockResolvedValue([pastShowtimeObj, futureShowtimeObj]);

          const result = await showtimeService.getFutureShowtimesByMovieId('m1');
          
          expect(result).toHaveLength(1);
          expect(result[0].id).toBe('2');
          expect(result[0]).toHaveProperty('status'); // Verify status field is added
      });
  });

  describe('getShowtimesByDate', () => {
      it('should filter past showtimes when filterPast is true', async () => {
          // Setup a past showtime today and a future showtime today
          // This requires precise time handling.
          // I will use Yesterday and Tomorrow to be absolutely safe without Date mocking.
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          const pastShowtime = new Showtime('1', 'm1', 't1', yesterday, '10:00');
          const futureShowtime = new Showtime('2', 'm1', 't1', tomorrow, '10:00');

          mockRepository.findByDate.mockResolvedValue([pastShowtime, futureShowtime]);

          const result = await showtimeService.getShowtimesByDate('some-date', true);
           expect(result).toHaveLength(1);
          expect(result[0].id).toBe('2');
      });

      it('should return all showtimes when filterPast is false', async () => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          const pastShowtime = new Showtime('1', 'm1', 't1', yesterday, '10:00');
          const futureShowtime = new Showtime('2', 'm1', 't1', tomorrow, '10:00');

          mockRepository.findByDate.mockResolvedValue([pastShowtime, futureShowtime]);

          const result = await showtimeService.getShowtimesByDate('some-date', false);
          expect(result).toHaveLength(2);
      });
  });
});
