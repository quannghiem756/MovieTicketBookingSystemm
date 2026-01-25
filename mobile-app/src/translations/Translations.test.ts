import en from './en';
import vi from './vi';

describe('Translation Keys', () => {
  it('should have authentication error keys in English', () => {
    // These keys don't exist yet, so this test should fail
    expect((en as any).auth.error).toBeDefined();
    expect((en as any).auth.error.fillAll).toBeDefined();
    expect((en as any).auth.error.googleLogin).toBeDefined();
    expect((en as any).auth.error.loginFailed).toBeDefined();
    expect((en as any).auth.error.passwordMismatch).toBeDefined();
    expect((en as any).auth.error.registrationFailed).toBeDefined();
  });

  it('should have authentication error keys in Vietnamese', () => {
    expect((vi as any).auth.error).toBeDefined();
    expect((vi as any).auth.error.fillAll).toBeDefined();
    // ... check others
  });
});
