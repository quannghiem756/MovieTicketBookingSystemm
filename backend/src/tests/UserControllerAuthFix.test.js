const UserController = require('../interfaces/http/controllers/UserController');
const httpMocks = require('node-mocks-http');

describe('UserController Auth Fix & Resend OTP', () => {
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
    };
    mockOTPService = {
      generateOTP: jest.fn(),
      saveOTP: jest.fn(),
    };
    mockEmailService = {
      sendEmail: jest.fn(),
    };
    userController = new UserController(mockUserService, mockAuthService, mockOTPService, mockEmailService);
  });

  describe('authenticateUser', () => {
    it('should return 403 Forbidden when authService throws "Email not verified"', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { email: 'test@test.com', password: 'password' }
      });
      const res = httpMocks.createResponse();

      mockAuthService.authenticateUser.mockRejectedValue(new Error('Email not verified'));

      await userController.authenticateUser(req, res);

      expect(res.statusCode).toBe(403);
      const data = JSON.parse(res._getData());
      expect(data.error).toBe('Email not verified');
    });
  });

  describe('resendVerificationOTP', () => {
    it('should resend OTP if user exists and is unverified', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: { email: 'test@test.com' }
        });
        const res = httpMocks.createResponse();

        const mockUser = { id: '1', email: 'test@test.com', isVerified: false };
        mockUserService.getUserByEmail.mockResolvedValue(mockUser);
        mockOTPService.generateOTP.mockReturnValue('123456');

        await userController.resendVerificationOTP(req, res);

        expect(res.statusCode).toBe(200);
        expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('test@test.com');
        expect(mockOTPService.saveOTP).toHaveBeenCalledWith('test@test.com', '123456', 'registration');
        expect(mockEmailService.sendEmail).toHaveBeenCalled();
        expect(JSON.parse(res._getData()).message).toContain('OTP sent');
    });

    it('should return 404 if user not found', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: { email: 'unknown@test.com' }
        });
        const res = httpMocks.createResponse();

        mockUserService.getUserByEmail.mockResolvedValue(null);

        await userController.resendVerificationOTP(req, res);

        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res._getData()).error).toBe('User not found');
    });

    it('should return 400 if user is already verified', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: { email: 'verified@test.com' }
        });
        const res = httpMocks.createResponse();

        mockUserService.getUserByEmail.mockResolvedValue({ isVerified: true });

        await userController.resendVerificationOTP(req, res);

        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res._getData()).error).toBe('User is already verified');
    });
  });
});
