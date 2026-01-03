describe('Authentication Flow', () => {
  const testUser = {
    email: 'admin@example.com',
    password: 'admin123'
  };

  it('should login successfully with valid credentials', () => {
    cy.visit('/login');
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Verify successful login by checking URL or presence of user avatar/logout button
    cy.url().should('not.include', '/login');
    cy.get('button').find('.MuiAvatar-root').should('exist');
  });
});