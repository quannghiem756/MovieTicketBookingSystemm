describe('Health Check', () => {
  it('should load the home page successfully', () => {
    cy.visit('/');
    // Check for "Now Showing" section title
    cy.contains('Now Showing').should('be.visible');
    // Check for "Coming Soon" section title
    cy.contains('Coming Soon').should('be.visible');
    // Check if the Header is present and contains the Login link
    cy.get('header').contains('Login').should('be.visible');
  });
});
