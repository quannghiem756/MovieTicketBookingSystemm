const RefreshToken = require('../domain/RefreshToken');

describe('RefreshToken Domain Entity', () => {
  it('should instantiate RefreshToken correctly', () => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10000);
    const rt = new RefreshToken('id123', 'user123', 'token123', expiresAt, now);
    
    expect(rt.id).toBe('id123');
    expect(rt.userId).toBe('user123');
    expect(rt.token).toBe('token123');
    expect(rt.expiresAt).toBe(expiresAt);
    expect(rt.createdAt).toBe(now);
  });

  it('should correctly check if token is expired', () => {
    const past = new Date(Date.now() - 10000);
    const future = new Date(Date.now() + 10000);
    
    const rtExpired = new RefreshToken('id1', 'u1', 't1', past);
    const rtValid = new RefreshToken('id2', 'u2', 't2', future);
    
    expect(rtExpired.isExpired()).toBe(true);
    expect(rtValid.isExpired()).toBe(false);
  });
});
