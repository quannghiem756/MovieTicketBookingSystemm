import * as supportService from './supportService';
import api from './api';

jest.mock('./api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('supportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTicket', () => {
    it('calls api.post with ticket data', async () => {
      const mockTicket = { subject: 'Test', message: 'Hello' };
      const mockResponse = { id: '1', ...mockTicket };
      mockedApi.post.mockResolvedValue({ data: mockResponse });

      const result = await supportService.createTicket(mockTicket);

      expect(mockedApi.post).toHaveBeenCalledWith('/support/tickets', mockTicket);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTicketByToken', () => {
    it('calls api.get with token', async () => {
      const token = 'abc-123';
      const mockResponse = { ticket: { id: '1' } };
      mockedApi.get.mockResolvedValue({ data: mockResponse });

      const result = await supportService.getTicketByToken(token);

      expect(mockedApi.get).toHaveBeenCalledWith(`/support/public/${token}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('replyToTicket', () => {
    it('calls api.post with token and content', async () => {
      const token = 'abc-123';
      const content = 'My reply';
      const mockResponse = { success: true };
      mockedApi.post.mockResolvedValue({ data: mockResponse });

      const result = await supportService.replyToTicket(token, content);

      expect(mockedApi.post).toHaveBeenCalledWith(`/support/public/${token}/reply`, { content });
      expect(result).toEqual(mockResponse);
    });
  });
});
