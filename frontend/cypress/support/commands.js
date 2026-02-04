// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

Cypress.Commands.add('demoClick', { prevSubject: 'element' }, (subject, options = {}) => {
  cy.wrap(subject).scrollIntoView().should('be.visible').wait(500);
  cy.wrap(subject).click(options);
  return cy.wait(500);
});

Cypress.Commands.add('demoType', { prevSubject: 'element' }, (subject, text, options = {}) => {
  cy.wrap(subject).scrollIntoView().should('be.visible').wait(300);
  cy.wrap(subject).type(text, { delay: 50, ...options });
  return cy.wait(300);
});

Cypress.Commands.add('demoSelect', { prevSubject: 'element' }, (subject, value, options = {}) => {
  cy.wrap(subject).scrollIntoView().should('be.visible').wait(300);
  cy.wrap(subject).select(value, options);
  return cy.wait(500);
});
