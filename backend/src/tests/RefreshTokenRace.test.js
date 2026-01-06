const AuthService = require('../application/AuthService');
const jwt = require('jsonwebtoken');

describe('RefreshTokenRace', () => {
  let authService;
  let mockUserService;
  let mockRefreshTokenRepository;
  const refreshTokenSecret = 'refresh_token_secret';

  beforeEach(() => {
    process.env.REFRESH_TOKEN_SECRET = refreshTokenSecret;
    mockUserService = {
      getUserById: jest.fn(),
    };
    mockRefreshTokenRepository = {
      create: jest.fn(),
      findByToken: jest.fn(),
      deleteByToken: jest.fn(),
      markAsConsumed: jest.fn(),
      deleteAllForUser: jest.fn()
    };
    authService = new AuthService(mockUserService, mockRefreshTokenRepository);
  });

  it('reproduces race condition where concurrent refreshes trigger reuse detection', async () => {
    const userId = 'user123';
    const mockUser = { id: userId, email: 'test@test.com', name: 'Test' };
    const oldToken = jwt.sign({ id: userId }, refreshTokenSecret);

    // Initial state: token exists in DB
    let tokenExists = true;
    mockRefreshTokenRepository.findByToken.mockImplementation(async (token) => {
        if (token === oldToken && tokenExists) {
            return { userId, token: oldToken, expiresAt: new Date(Date.now() + 10000) };
        }
        return null;
    });

    mockUserService.getUserById.mockResolvedValue(mockUser);
    
    // Simulate deletion
    mockRefreshTokenRepository.deleteByToken.mockImplementation(async (token) => {
        if (token === oldToken) {
            tokenExists = false;
        }
        return true;
    });

    mockRefreshTokenRepository.create.mockImplementation(async (data) => {
        return { id: 'new-token-id', ...data };
    });

    // We want to simulate Request 1 completing the deletion before Request 2 checks findByToken
    // But both were started "at the same time" (e.g. client sent multiple requests)
    
    // Let's wrap refreshTokens to allow us to control timing if needed, 
    // or just use Promise.all and see if it hits the race condition with current mocks.
    
    // Request 1 starts
    const req1 = authService.refreshTokens(oldToken);
    
    // Request 2 starts immediately after
    const req2 = authService.refreshTokens(oldToken);

    // One of them (or both) might fail depending on how JS event loop handles the async calls.
    // In current implementation, if we don't have delays, they might both see tokenExists = true
    // because findByToken is called before any deleteByToken.
    
    try {
        const results = await Promise.all([req1, req2]);
        console.log('Both refreshes succeeded - created multiple tokens');
        // If both succeed, we have a "multiple tokens created" problem.
    } catch (error) {
        console.log('One refresh failed with error:', error.message);
        // If one fails with 'Invalid refresh token', we have a "reuse detection" problem.
    }

    // To GUARANTEE a failure in the test to reproduce "reuse detection" trigger:
    // We can make findByToken for Req 2 wait until Req 1 has called deleteByToken.
  });

  it('resolves race condition by allowing grace period for recently rotated tokens', async () => {
    const userId = 'user123';
    const mockUser = { id: userId, email: 'test@test.com', name: 'Test' };
    const oldToken = jwt.sign({ id: userId }, refreshTokenSecret);
    const newToken = 'new-rotated-token';

    let dbToken = { 
        userId, 
        token: oldToken, 
        expiresAt: new Date(Date.now() + 10000),
        consumedAt: null,
        replacedBy: null
    };

    mockRefreshTokenRepository.findByToken.mockImplementation(async () => dbToken);
    mockUserService.getUserById.mockResolvedValue(mockUser);
    
    mockRefreshTokenRepository.markAsConsumed.mockImplementation(async (token, replacement) => {
        dbToken.consumedAt = new Date();
        dbToken.replacedBy = replacement;
        return { ...dbToken };
    });

    mockRefreshTokenRepository.create.mockResolvedValue({});

    // Simultaneous requests
    const [res1, res2] = await Promise.all([
        authService.refreshTokens(oldToken),
        authService.refreshTokens(oldToken)
    ]);

    // Both should succeed
    expect(res1.refreshToken).toBeDefined();
    expect(res2.refreshToken).toBeDefined();
    
    // One of them will be the original "new" token, the other will be the "replacement" 
    // In our implementation, they should both point to the SAME new refresh token.
    expect(res1.refreshToken).toBe(res2.refreshToken);
    
    // Check that we only created ONE new token record in DB (called once by the first request)
    expect(mockRefreshTokenRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRefreshTokenRepository.deleteAllForUser).not.toHaveBeenCalled();
  });
});
