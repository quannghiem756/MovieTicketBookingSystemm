describe('User Login', () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';

  beforeEach(() => {
    cy.intercept('POST', '**/api/users/login').as('loginRequest');
    cy.visit('/login');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('#email').focus().blur();
    cy.get('#password').focus().blur();
    
    cy.contains('Email không được để trống').should('be.visible');
    cy.get('#password-helper-text').should('contain', 'không được để trống');
  });

  it('should show error for incorrect credentials', () => {
    cy.get('#email').type('wrong@example.com');
    cy.get('#password').type('WrongPass123!');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    
    // Check for the alert message - it might take a moment to render
    cy.get('.MuiAlert-root', { timeout: 10000 }).should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('should login successfully as admin and redirect to admin dashboard', () => {
    cy.get('#email').type(adminEmail);
    cy.get('#password').type(adminPassword);
    cy.get('button[type="submit"]').click();
    
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    
    cy.url().should('include', '/admin');
    
    // Check for the main heading on the dashboard
    cy.get('h1').contains('Bảng điều khiển').should('be.visible');
  });
});
