describe('Health Check', () => {
  it('should load the home page successfully', () => {
    cy.visit('/');
    // Check for "Now Showing" section title (Vietnamese)
    cy.contains('Đang chiếu').should('be.visible');
    // Check for "Coming Soon" section title (Vietnamese)
    cy.contains('Sắp chiếu').should('be.visible');
    // Check if the Header is present and contains the Login link (Vietnamese)
    cy.get('header').contains('Đăng nhập').should('be.visible');
  });
});
