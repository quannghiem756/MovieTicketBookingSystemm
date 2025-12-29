describe('Route Protection', () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  const userEmail = 'newuser@example.com'; 
  // We'll register a new user or use a mock for non-admin test

  beforeEach(() => {
    // Ensure we are logged out before each test
    // Assuming we can clear localStorage
    cy.window().then((window) => {
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('user');
    });
  });

  it('should redirect unauthenticated user to login when accessing /bookings', () => {
    cy.visit('/bookings');
    cy.url().should('include', '/login');
  });

  it('should redirect unauthenticated user to login when accessing /profile', () => {
    cy.visit('/profile');
    cy.url().should('include', '/login');
  });

  it('should redirect unauthenticated user to login when accessing /admin', () => {
    cy.visit('/admin');
    cy.url().should('include', '/login');
  });

  it('should redirect non-admin user to home when accessing /admin', () => {
    // 1. Login as regular user
    // We can register a fresh user or mock the login response
    // Mocking is faster and cleaner for this specific test
    
    const mockUser = {
      id: '123',
      name: 'Regular User',
      email: 'user@test.com',
      role: 'user'
    };

    cy.intercept('POST', '**/api/users/login', {
      statusCode: 200,
      body: {
        user: mockUser,
        accessToken: 'mock-access-token'
      }
    }).as('loginUser');

    cy.visit('/login');
    cy.get('#email').type('user@test.com');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginUser');
    cy.url().should('not.include', '/login');

    // 2. Try to visit admin
    cy.visit('/admin');

    // 3. Verify redirect to home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains('Bảng điều khiển').should('not.exist'); // Admin dashboard text
  });
});
