const ShowtimeService = require('../application/ShowtimeService');
const Showtime = require('../domain/Showtime');

describe('Showtime Verification Scenarios', () => {
    let showtimeService;
    let mockRepository;

    beforeEach(() => {
        mockRepository = {
            findFutureByMovieId: jest.fn(),
            findByDate: jest.fn(),
        };
        showtimeService = new ShowtimeService(mockRepository);
    });

    const createShowtime = (id, dateStr, timeStr) => {
         return new Showtime(id, 'm1', 't1', new Date(dateStr), timeStr, '2D', 'English', 100);
    };

    it('Scenario: Customer fetching Future Showtimes should not see past showtimes', async () => {
        // Use yesterday/tomorrow to be time-zone agnostic and robust
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const pastShowtime = createShowtime('1', yesterday.toISOString(), '10:00');
        const futureShowtime = createShowtime('2', tomorrow.toISOString(), '10:00');

        mockRepository.findFutureByMovieId.mockResolvedValue([pastShowtime, futureShowtime]);

        const result = await showtimeService.getFutureShowtimesByMovieId('m1');

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
    });

    it('Scenario: Customer fetching Daily Schedule should not see past showtimes', async () => {
         const yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);
         const tomorrow = new Date();
         tomorrow.setDate(tomorrow.getDate() + 1);

         // Even if we query for "today", if the repo returns yesterday's showtime (e.g. slight overlap or bad data), it should be filtered.
         // More realistically, let's use a "Past" showtime of Today.
         // But "Past" logic depends on current time. 
         // Let's use Yesterday for guaranteed "Past" status.
         
         const pastShowtimeObj = createShowtime('1', yesterday.toISOString(), '10:00');
         const futureShowtimeObj = createShowtime('2', tomorrow.toISOString(), '10:00');

         mockRepository.findByDate.mockResolvedValue([pastShowtimeObj, futureShowtimeObj]);

         // Customer passes filterPast=true
         const result = await showtimeService.getShowtimesByDate('some-date', true);

         expect(result).toHaveLength(1);
         expect(result[0].id).toBe('2');
    });

    it('Scenario: Admin fetching Daily Schedule should see ALL showtimes', async () => {
         const yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);
         const tomorrow = new Date();
         tomorrow.setDate(tomorrow.getDate() + 1);

         const pastShowtimeObj = createShowtime('1', yesterday.toISOString(), '10:00');
         const futureShowtimeObj = createShowtime('2', tomorrow.toISOString(), '10:00');

         mockRepository.findByDate.mockResolvedValue([pastShowtimeObj, futureShowtimeObj]);

         // Admin (or default) passes filterPast=false
         const result = await showtimeService.getShowtimesByDate('some-date', false);

         expect(result).toHaveLength(2);
    });
});
