import LoginPage from '../support/pages/LoginPage';

describe('Authentication Flow', () => {
  const testUser = {
    email: 'admin@example.com',
    password: 'admin123'
  };

  it('should login successfully with valid credentials', () => {
    LoginPage.visit();
    LoginPage.login(testUser.email, testUser.password);
    LoginPage.verifySuccessfulLogin();
  });
});