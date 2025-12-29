const httpMocks = require('node-mocks-http');

describe('Auth Middleware', () => {
  let req, res, next, authenticate;
  let mockAuthService;
  let mockUserService;

  beforeEach(() => {
    jest.resetModules();
    
    mockAuthService = {
        verifyAccessToken: jest.fn(),
    };
    mockUserService = {
        getUserById: jest.fn(),
    };

    // Use doMock to mock modules for THIS test file
    jest.doMock('../application/AuthService', () => {
        return jest.fn().mockImplementation(() => mockAuthService);
    });
    jest.doMock('../application/UserService', () => {
        return jest.fn().mockImplementation(() => mockUserService);
    });
    jest.doMock('../infrastructure/repositories/MongoUserRepository', () => {
        return jest.fn().mockImplementation(() => ({}));
    });
    jest.doMock('../infrastructure/repositories/MongoRefreshTokenRepository', () => {
        return jest.fn().mockImplementation(() => ({}));
    });

    // Require the middleware AFTER mocking its dependencies
    ({ authenticate } = require('../interfaces/http/middleware/auth'));
    
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('should authenticate with valid Bearer token', async () => {
    req.headers.authorization = 'Bearer valid-token';

    mockAuthService.verifyAccessToken.mockReturnValue({ id: 'u123' });
    mockUserService.getUserById.mockResolvedValue({ id: 'u123', name: 'Test' });

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe('u123');
  });

  it('should authenticate with valid cookie token if header is missing', async () => {
    req.cookies = { accessToken: 'valid-cookie-token' };
    
    mockAuthService.verifyAccessToken.mockReturnValue({ id: 'u123' });
    mockUserService.getUserById.mockResolvedValue({ id: 'u123', name: 'Test' });

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe('u123');
  });

  it('should return 401 if no token provided', async () => {
    await authenticate(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Authentication required' });
  });

  it('should return 401 if user not found', async () => {
    req.headers.authorization = 'Bearer valid-token';
    mockAuthService.verifyAccessToken.mockReturnValue({ id: 'u123' });
    mockUserService.getUserById.mockResolvedValue(null);

    await authenticate(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({ error: 'User not found' });
  });

  it('should return 401 if token is invalid', async () => {
    req.headers.authorization = 'Bearer invalid';
    mockAuthService.verifyAccessToken.mockImplementation(() => {
        throw new Error('Invalid token');
    });

    await authenticate(req, res, next);
    expect(res.statusCode).toBe(401);
  });

  describe('authorizeAdmin', () => {
    let authorizeAdmin;
    beforeEach(() => {
        ({ authorizeAdmin } = require('../interfaces/http/middleware/auth'));
    });

    it('should allow admin user', () => {
        req.user = { role: 'admin' };
        authorizeAdmin(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no user on request', () => {
        authorizeAdmin(req, res, next);
        expect(res.statusCode).toBe(401);
    });

    it('should return 403 if user is not admin', () => {
        req.user = { role: 'user' };
        authorizeAdmin(req, res, next);
        expect(res.statusCode).toBe(403);
    });
  });
});
