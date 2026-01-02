const ShowtimeController = require('../interfaces/http/controllers/ShowtimeController');

describe('ShowtimeController', () => {
  let controller;
  let mockService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockService = {
      createShowtime: jest.fn(),
      getAllShowtimes: jest.fn(),
      getShowtimeById: jest.fn(),
      getShowtimesByMovieId: jest.fn(),
      getFutureShowtimesByMovieId: jest.fn(),
      getShowtimesByDate: jest.fn(),
      updateShowtime: jest.fn(),
      deleteShowtime: jest.fn()
    };
    controller = new ShowtimeController(mockService);
    mockReq = {
      query: {},
      params: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getShowtimesByDate', () => {
      it('should return 400 if date is missing', async () => {
          mockReq.query = {};
          await controller.getShowtimesByDate(mockReq, mockRes);
          expect(mockRes.status).toHaveBeenCalledWith(400);
          expect(mockRes.json).toHaveBeenCalledWith({ error: 'Date parameter is required' });
      });

      it('should call service with date and filterPast=false by default', async () => {
          mockReq.query = { date: '2023-10-27' };
          mockService.getShowtimesByDate.mockResolvedValue([]);
          
          await controller.getShowtimesByDate(mockReq, mockRes);
          
          expect(mockService.getShowtimesByDate).toHaveBeenCalledWith('2023-10-27', false);
          expect(mockRes.json).toHaveBeenCalledWith([]);
      });

      it('should call service with date and filterPast=true when query param is true', async () => {
          mockReq.query = { date: '2023-10-27', filterPast: 'true' };
          mockService.getShowtimesByDate.mockResolvedValue([]);
          
          await controller.getShowtimesByDate(mockReq, mockRes);
          
          expect(mockService.getShowtimesByDate).toHaveBeenCalledWith('2023-10-27', true);
      });
  });
});
