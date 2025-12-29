describe('User Registration', () => {
  const randomEmail = `testuser_${Math.floor(Math.random() * 100000)}@example.com`;

  beforeEach(() => {
    cy.visit('/register');
  });

  it('should show validation errors when fields are touched and left empty', () => {
    // Focus and blur to trigger our custom validation
    cy.get('#name').focus().blur();
    cy.get('#email').focus().blur();
    cy.get('#password').focus().blur();
    
    cy.contains('Tên không được để trống').should('be.visible');
    cy.contains('Email không được để trống').should('be.visible');
    cy.contains('Mật khẩu không được để trống').should('be.visible');
  });

  it('should show error for password mismatch', () => {
    cy.get('#name').type('Test User');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('Password123!');
    cy.get('#confirmPassword').type('Different123!');
    cy.get('#confirmPassword').blur();
    cy.contains('Mật khẩu không khớp').should('be.visible');
  });

  it('should register successfully and redirect to login', () => {
    cy.get('#name').type('Test User Success');
    cy.get('#email').type(randomEmail);
    cy.get('#password').type('Password123!');
    cy.get('#confirmPassword').type('Password123!');
    cy.get('#phone').type('0123456789');
    // Date of birth field in MUI might be tricky with .type(), but let's try
    cy.get('#dateOfBirth').type('1990-01-01');
    
    cy.get('button[type="submit"]').click();
    
    // Check for redirect to /login
    cy.url().should('include', '/login');
    // Check for specific login page title
    cy.contains('Đăng nhập vào tài khoản của bạn').should('be.visible');
  });
});
