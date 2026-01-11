import * as movieService from './movieService';
import api from './api';

jest.mock('./api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('movieService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNewsById', () => {
    it('calls api.get with the correct URL', async () => {
      const mockNews = { id: 'news1', title: 'Test News' };
      mockedApi.get.mockResolvedValue({ data: mockNews });

      const result = await movieService.getNewsById('news1');

      expect(mockedApi.get).toHaveBeenCalledWith('/news/news1');
      expect(result).toEqual(mockNews);
    });

    it('throws error when API call fails', async () => {
      mockedApi.get.mockRejectedValue(new Error('API Error'));

      await expect(movieService.getNewsById('news1')).rejects.toThrow('API Error');
    });
  });
});
