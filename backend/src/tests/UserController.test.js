const UserController = require('../interfaces/http/controllers/UserController');
const httpMocks = require('node-mocks-http');

describe('UserController', () => {
  let userController;
  let mockUserService;
  let mockAuthService;

  beforeEach(() => {
    mockUserService = {
        createUser: jest.fn(),
        getAllUsers: jest.fn(),
        getUserById: jest.fn(),
        getUserByEmail: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn()
    };
    mockAuthService = {
      authenticateUser: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
      verifyGoogleToken: jest.fn(),
      googleLogin: jest.fn()
    };
    userController = new UserController(mockUserService, mockAuthService);
  });

  describe('createUser', () => {
    it('should create a user', async () => {
        const userData = { name: 'Test' };
        const req = httpMocks.createRequest({ method: 'POST', body: userData });
        const res = httpMocks.createResponse();
        mockUserService.createUser.mockResolvedValue({ id: '1', ...userData });
        await userController.createUser(req, res);
        expect(res.statusCode).toBe(201);
    });

    it('should return 400 on error', async () => {
        const req = httpMocks.createRequest({ method: 'POST' });
        const res = httpMocks.createResponse();
        mockUserService.createUser.mockRejectedValue(new Error('Fail'));
        await userController.createUser(req, res);
        expect(res.statusCode).toBe(400);
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
    it('should return 404 if not found', async () => {
        const req = httpMocks.createRequest({ method: 'GET', params: { id: '1' } });
        const res = httpMocks.createResponse();
        mockUserService.getUserById.mockResolvedValue(null);
        await userController.getUserById(req, res);
        expect(res.statusCode).toBe(404);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user if found', async () => {
        const req = httpMocks.createRequest({ method: 'GET', params: { email: 't@t.com' } });
        const res = httpMocks.createResponse();
        mockUserService.getUserByEmail.mockResolvedValue({ id: '1' });
        await userController.getUserByEmail(req, res);
        expect(res.statusCode).toBe(200);
    });
    it('should return 404 if not found', async () => {
        const req = httpMocks.createRequest({ method: 'GET', params: { email: 't@t.com' } });
        const res = httpMocks.createResponse();
        mockUserService.getUserByEmail.mockResolvedValue(null);
        await userController.getUserByEmail(req, res);
        expect(res.statusCode).toBe(404);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
        const req = httpMocks.createRequest({ method: 'PUT', params: { id: '1' }, body: { name: 'New' } });
        const res = httpMocks.createResponse();
        mockUserService.updateUser.mockResolvedValue({ id: '1', name: 'New' });
        await userController.updateUser(req, res);
        expect(res.statusCode).toBe(200);
    });
    it('should return 404 if user not found', async () => {
        const req = httpMocks.createRequest({ method: 'PUT', params: { id: '1' } });
        const res = httpMocks.createResponse();
        mockUserService.updateUser.mockResolvedValue(null);
        await userController.updateUser(req, res);
        expect(res.statusCode).toBe(404);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
        const req = httpMocks.createRequest({ method: 'DELETE', params: { id: '1' } });
        const res = httpMocks.createResponse();
        mockUserService.deleteUser.mockResolvedValue(true);
        await userController.deleteUser(req, res);
        expect(res.statusCode).toBe(200);
    });
    it('should return 404 if user not found', async () => {
        const req = httpMocks.createRequest({ method: 'DELETE', params: { id: '1' } });
        const res = httpMocks.createResponse();
        mockUserService.deleteUser.mockResolvedValue(false);
        await userController.deleteUser(req, res);
        expect(res.statusCode).toBe(404);
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
      expect(data.refreshToken).toBeUndefined();

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

  describe('googleLogin', () => {
    it('should login with Google and set cookie', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: { idToken: 'google-token' }
      });
      const res = httpMocks.createResponse();

      mockAuthService.verifyGoogleToken.mockResolvedValue({ sub: 'g1', email: 'g@g.com' });
      mockAuthService.googleLogin.mockResolvedValue({
        user: { id: 'u1', name: 'G' },
        accessToken: 'acc',
        refreshToken: 'ref'
      });

      await userController.googleLogin(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.cookies.refreshToken.value).toBe('ref');
      expect(JSON.parse(res._getData()).user.name).toBe('G');
    });

    it('should return 400 if idToken is missing', async () => {
        const req = httpMocks.createRequest({ method: 'POST' });
        const res = httpMocks.createResponse();
        await userController.googleLogin(req, res);
        expect(res.statusCode).toBe(400);
    });
  });

  describe('refreshToken', () => {
    it('should use cookie if body is missing and set new cookie', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        cookies: { refreshToken: 'old-token' }
      });
      const res = httpMocks.createResponse();

      mockAuthService.refreshTokens.mockResolvedValue({
        accessToken: 'new-access',
        refreshToken: 'new-refresh'
      });

      await userController.refreshToken(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData()).accessToken).toBe('new-access');
      expect(res.cookies.refreshToken.value).toBe('new-refresh');
    });

    it('should return 401 on service error', async () => {
        const req = httpMocks.createRequest({ method: 'POST', cookies: { refreshToken: 'token' } });
        const res = httpMocks.createResponse();
        mockAuthService.refreshTokens.mockRejectedValue(new Error('Fail'));
        await userController.refreshToken(req, res);
        expect(res.statusCode).toBe(401);
    });
  });

  describe('logout', () => {
    it('should clear cookie and call service', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          cookies: { refreshToken: 'token-to-delete' }
        });
        const res = httpMocks.createResponse();
  
        await userController.logout(req, res);
  
        expect(mockAuthService.logout).toHaveBeenCalledWith('token-to-delete');
        expect(res.cookies.refreshToken.value).toBe('');
    });
  });
});
