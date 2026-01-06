const UserController = require('../interfaces/http/controllers/UserController');
const httpMocks = require('node-mocks-http');

describe('UserController', () => {
  let userController;
  let mockUserService;
  let mockAuthService;
  let mockOTPService;
  let mockEmailService;

  beforeEach(() => {
    mockUserService = {
        createUser: jest.fn(),
        getAllUsers: jest.fn(),
        getUserById: jest.fn(),
        getUserByEmail: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
        resetPassword: jest.fn()
    };
    mockAuthService = {
      authenticateUser: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
      verifyGoogleToken: jest.fn(),
      googleLogin: jest.fn()
    };
    mockOTPService = {
        generateOTP: jest.fn(),
        saveOTP: jest.fn(),
        verifyOTP: jest.fn()
    };
    mockEmailService = {
        sendEmail: jest.fn(),
        verifyConnection: jest.fn()
    };
    userController = new UserController(mockUserService, mockAuthService, mockOTPService, mockEmailService);
  });

  describe('createUser', () => {
    it('should create a user and send OTP', async () => {
        const userData = { name: 'Test', email: 'test@test.com' };
        const req = httpMocks.createRequest({ method: 'POST', body: userData });
        const res = httpMocks.createResponse();
        
        mockUserService.createUser.mockResolvedValue({ id: '1', ...userData });
        mockOTPService.generateOTP.mockReturnValue('123456');
        mockOTPService.saveOTP.mockResolvedValue({});
        mockEmailService.sendEmail.mockResolvedValue({});

        await userController.createUser(req, res);
        
        expect(res.statusCode).toBe(201);
        expect(mockOTPService.generateOTP).toHaveBeenCalled();
        expect(mockOTPService.saveOTP).toHaveBeenCalledWith('test@test.com', '123456', 'registration');
        expect(mockEmailService.sendEmail).toHaveBeenCalled();
        
        const data = JSON.parse(res._getData());
        expect(data.message).toContain('Please check your email for OTP');
    });

    it('should return 400 on error', async () => {
        const req = httpMocks.createRequest({ method: 'POST' });
        const res = httpMocks.createResponse();
        mockUserService.createUser.mockRejectedValue(new Error('Fail'));
        await userController.createUser(req, res);
        expect(res.statusCode).toBe(400);
    });
  });

  describe('verifyRegistration', () => {
    it('should verify OTP and update user to verified', async () => {
        const req = httpMocks.createRequest({ 
            method: 'POST', 
            body: { email: 'test@test.com', otp: '123456' } 
        });
        const res = httpMocks.createResponse();

        mockOTPService.verifyOTP.mockResolvedValue(true);
        mockUserService.getUserByEmail.mockResolvedValue({ id: '1', email: 'test@test.com' });
        mockUserService.updateUser.mockResolvedValue({ id: '1', isVerified: true });

        await userController.verifyRegistration(req, res);

        expect(res.statusCode).toBe(200);
        expect(mockUserService.updateUser).toHaveBeenCalled();
        expect(JSON.parse(res._getData()).message).toContain('Email verified successfully');
    });

    it('should return 400 if OTP is invalid', async () => {
        const req = httpMocks.createRequest({ method: 'POST', body: { email: 't', otp: 'wrong' } });
        const res = httpMocks.createResponse();
        mockOTPService.verifyOTP.mockResolvedValue(false);
        await userController.verifyRegistration(req, res);
        expect(res.statusCode).toBe(400);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset OTP', async () => {
        const req = httpMocks.createRequest({ method: 'POST', body: { email: 'test@test.com' } });
        const res = httpMocks.createResponse();

        mockUserService.getUserByEmail.mockResolvedValue({ id: '1', email: 'test@test.com' });
        mockOTPService.generateOTP.mockReturnValue('654321');

        await userController.forgotPassword(req, res);

        expect(res.statusCode).toBe(200);
        expect(mockOTPService.saveOTP).toHaveBeenCalledWith('test@test.com', '654321', 'password_reset');
        expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password if OTP is valid', async () => {
        const req = httpMocks.createRequest({ 
            method: 'POST', 
            body: { email: 'test@test.com', otp: '654321', newPassword: 'new' } 
        });
        const res = httpMocks.createResponse();

        mockOTPService.verifyOTP.mockResolvedValue(true);
        mockUserService.getUserByEmail.mockResolvedValue({ id: '1' });

        await userController.resetPassword(req, res);

        expect(res.statusCode).toBe(200);
        expect(mockUserService.resetPassword).toHaveBeenCalledWith('1', 'new');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
        const req = httpMocks.createRequest({ method: 'GET' });
        const res = httpMocks.createResponse();
        mockUserService.getAllUsers.mockResolvedValue([]);
        await userController.getAllUsers(req, res);
        expect(res.statusCode).toBe(200);
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
        const req = httpMocks.createRequest({ method: 'GET', params: { id: '1' } });
        const res = httpMocks.createResponse();
        mockUserService.getUserById.mockResolvedValue({ id: '1' });
        await userController.getUserById(req, res);
        expect(res.statusCode).toBe(200);
    });
  });

  describe('authenticateUser', () => {
    it('should set HttpOnly cookie on successful login', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { email: 'test@test.com', password: 'password' }
      });
      const res = httpMocks.createResponse();

      mockAuthService.authenticateUser.mockResolvedValue({
        user: { id: 'u123', name: 'Test' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      });

      await userController.authenticateUser(req, res);

      expect(res.statusCode).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.accessToken).toBe('access-token');

      expect(res.cookies.refreshToken).toBeDefined();
      expect(res.cookies.refreshToken.value).toBe('refresh-token');
    });

    it('should return 401 on invalid credentials', async () => {
        const req = httpMocks.createRequest({ method: 'POST' });
        const res = httpMocks.createResponse();
        mockAuthService.authenticateUser.mockResolvedValue(null);
        await userController.authenticateUser(req, res);
        expect(res.statusCode).toBe(401);
    });
  });
});