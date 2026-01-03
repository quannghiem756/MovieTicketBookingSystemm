class LoginPage {
  visit() {
    cy.visit('/login');
  }

  getEmailInput() {
    return cy.get('#email');
  }

  getPasswordInput() {
    return cy.get('#password');
  }

  getSubmitButton() {
    return cy.get('button[type="submit"]');
  }

  login(email, password) {
    this.getEmailInput().type(email);
    this.getPasswordInput().type(password);
    this.getSubmitButton().click();
  }

  verifySuccessfulLogin() {
    cy.url().should('not.include', '/login');
    cy.get('button').find('.MuiAvatar-root').should('exist');
  }
}

export default new LoginPage();
