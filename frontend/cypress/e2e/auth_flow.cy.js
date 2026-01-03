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

  it('should refresh the access token when it expires', () => {
    // 1. Login
    LoginPage.visit();
    LoginPage.login(testUser.email, testUser.password);
    LoginPage.verifySuccessfulLogin();

    // 2. Intercept a request (e.g., getting news) and force a 401
    // We use a counter to ensure we only 401 the first time
    let count = 0;
    cy.intercept('GET', '**/api/news**', (req) => {
      count++;
      if (count === 1) {
        req.reply({
          statusCode: 401,
          body: { message: 'Unauthorized' }
        });
      } else {
        req.reply({
          statusCode: 200,
          body: { news: [], total: 0, page: 1, limit: 10 }
        });
      }
    }).as('newsRequest');

    // 3. Intercept refresh token call
    cy.intercept('POST', '**/api/users/refresh-token', {
      statusCode: 200,
      body: { accessToken: 'new-valid-token' }
    }).as('refreshTokenCall');

    // 4. Trigger the request (go to news page)
    cy.visit('/news');

    // 5. Verify flow
    cy.wait('@newsRequest'); // First call (401)
    cy.wait('@refreshTokenCall'); // Refresh call
    cy.wait('@newsRequest'); // Retry call (200)
    
    // Verify localStorage updated
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.equal('new-valid-token');
    });
  });
});
