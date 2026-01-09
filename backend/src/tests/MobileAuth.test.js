const UserController = require('../interfaces/http/controllers/UserController');
const httpMocks = require('node-mocks-http');

describe('UserController Mobile Auth Support', () => {
  let userController;
  let mockUserService;
  let mockAuthService;
  let mockOTPService;
  let mockEmailService;

  beforeEach(() => {
    mockUserService = {
      getUserByEmail: jest.fn(),
    };
    mockAuthService = {
      authenticateUser: jest.fn(),
      googleLogin: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
      verifyGoogleToken: jest.fn(),
    };
    mockOTPService = {};
    mockEmailService = {};
    userController = new UserController(mockUserService, mockAuthService, mockOTPService, mockEmailService);
  });

  describe('authenticateUser', () => {
    it('should return refreshToken in JSON body for mobile clients', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { email: 'test@test.com', password: 'password' }
      });
      const res = httpMocks.createResponse();

      const mockResult = {
        user: { id: '1', email: 'test@test.com' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      };
      mockAuthService.authenticateUser.mockResolvedValue(mockResult);

      await userController.authenticateUser(req, res);

      const data = JSON.parse(res._getData());
      expect(data.refreshToken).toBe('refresh-token');
      expect(data.accessToken).toBe('access-token');
      expect(res.cookies.refreshToken.value).toBe('refresh-token');
    });
  });

  describe('refreshToken', () => {
    it('should accept refreshToken from body and return new refreshToken in body', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { refreshToken: 'old-refresh-token' }
      });
      const res = httpMocks.createResponse();

      mockAuthService.refreshTokens.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      });

      await userController.refreshToken(req, res);

      const data = JSON.parse(res._getData());
      expect(data.refreshToken).toBe('new-refresh-token');
      expect(data.accessToken).toBe('new-access-token');
      expect(res.cookies.refreshToken.value).toBe('new-refresh-token');
    });
  });

  describe('logout', () => {
    it('should accept refreshToken from body', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { refreshToken: 'token-to-logout' }
      });
      const res = httpMocks.createResponse();

      await userController.logout(req, res);

      expect(mockAuthService.logout).toHaveBeenCalledWith('token-to-logout');
      expect(res.statusCode).toBe(200);
    });
  });
});
