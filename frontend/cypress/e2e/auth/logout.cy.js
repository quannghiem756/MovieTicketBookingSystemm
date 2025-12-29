describe('User Logout', () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';

  beforeEach(() => {
    // We need to login first to test logout
    cy.visit('/login');
    cy.get('#email').type(adminEmail);
    cy.get('#password').type(adminPassword);
    cy.get('button[type="submit"]').click();
    
    // Wait for login to complete and redirect
    // Admin login redirects to /admin usually, but could be home depending on logic.
    // The previous test expects /admin.
    cy.url().should('include', '/admin');
  });

  it('should logout successfully and redirect to home page', () => {
    // 1. Open User Menu
    cy.get('[data-testid="user-menu-button"]').click();

    // 2. Click Logout
    cy.get('[data-testid="logout-button"]').should('be.visible').click();

    // 3. Verify Redirection to Home
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // 4. Verify Logout State
    // User menu should NOT be visible
    cy.get('[data-testid="user-menu-button"]').should('not.exist');
    
    // Check for Login button presence by checking for the link to /login
    cy.get('a[href="/login"]').should('be.visible');
  });
});
