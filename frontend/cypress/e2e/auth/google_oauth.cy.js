describe('Google OAuth Mocking', () => {
  const mockGoogleUser = {
    id: 'google-123',
    name: 'Google User',
    email: 'google-user@example.com',
    role: 'user'
  };

  beforeEach(() => {
    // Intercept Google script to prevent actual loading
    cy.intercept('GET', 'https://accounts.google.com/gsi/client', {
      body: ''
    }).as('googleScript');

    // Intercept Backend Google Login
    cy.intercept('POST', '**/api/users/google-login', {
      statusCode: 200,
      body: {
        user: mockGoogleUser,
        accessToken: 'mock-google-access-token'
      }
    }).as('googleBackendLogin');
  });

  it('should login successfully using mocked Google OAuth', () => {
    let capturedCallback;

    cy.visit('/login', {
      onBeforeLoad(win) {
        win.google = {
          accounts: {
            id: {
              initialize: (config) => {
                capturedCallback = config.callback;
              },
              renderButton: () => {
                // Mock render button
                const btn = win.document.getElementById('googleSignInBtn');
                if (btn) {
                  const fakeBtn = win.document.createElement('button');
                  fakeBtn.id = 'fake-google-btn';
                  fakeBtn.innerText = 'Mock Google Sign In';
                  fakeBtn.onclick = () => {
                    capturedCallback({ credential: 'mock-google-id-token' });
                  };
                  btn.appendChild(fakeBtn);
                }
              }
            }
          }
        };
      }
    });

    // Wait for the mock button to be rendered
    cy.get('#fake-google-btn').should('be.visible').click();

    // Verify backend call
    cy.wait('@googleBackendLogin').then((interception) => {
      expect(interception.request.body).to.have.property('idToken', 'mock-google-id-token');
    });

    // Verify redirect to home
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Verify logged in state
    cy.get('button').find('.MuiAvatar-root').should('exist');
  });

  it('should auto-register a new user via Google OAuth', () => {
    const newUser = {
      id: 'google-new-456',
      name: 'New Google User',
      email: 'new-google-user@example.com',
      role: 'user'
    };

    // Intercept Backend Google Login with a "new" user response
    cy.intercept('POST', '**/api/users/google-login', {
      statusCode: 200,
      body: {
        user: newUser,
        accessToken: 'mock-new-google-access-token'
      }
    }).as('googleAutoRegister');

    let capturedCallback;

    cy.visit('/login', {
      onBeforeLoad(win) {
        win.google = {
          accounts: {
            id: {
              initialize: (config) => {
                capturedCallback = config.callback;
              },
              renderButton: () => {
                const btn = win.document.getElementById('googleSignInBtn');
                if (btn) {
                  const fakeBtn = win.document.createElement('button');
                  fakeBtn.id = 'fake-google-btn-new';
                  fakeBtn.innerText = 'Mock New Google User';
                  fakeBtn.onclick = () => {
                    capturedCallback({ credential: 'new-user-id-token' });
                  };
                  btn.appendChild(fakeBtn);
                }
              }
            }
          }
        };
      }
    });

    cy.get('#fake-google-btn-new').should('be.visible').click();

    cy.wait('@googleAutoRegister');

    // Verify redirect to home
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Verify user info is correct in the profile
    cy.visit('/profile');
    cy.get('input[name="name"]').should('have.value', 'New Google User');
    cy.get('input[name="email"]').should('have.value', 'new-google-user@example.com');
  });
});
