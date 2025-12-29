describe('Session Persistence & Token Refresh', () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';

  // Helper to login
  const login = () => {
    cy.visit('/login');
    cy.get('#email').type(adminEmail);
    cy.get('#password').type(adminPassword);
    cy.get('button[type="submit"]').click();
    // Wait for redirect
    cy.url().should('not.include', '/login');
  };

  it('should persist session after page reload', () => {
    login();

    // Verify logged in (Avatar exists)
    cy.get('button').find('.MuiAvatar-root').should('exist');

    // Reload page
    cy.reload();

    // Verify still logged in
    cy.get('button').find('.MuiAvatar-root').should('exist');
    cy.url().should('not.include', '/login');
    
    // Check localStorage
    cy.window().then((window) => {
      expect(window.localStorage.getItem('accessToken')).to.exist;
      expect(window.localStorage.getItem('user')).to.exist;
    });
  });

  it('should refresh token when access token expires (401)', () => {
    // 1. Login first to populate localStorage
    login();

    // 2. Setup Intercepts
    let bookingsRequestCount = 0;

    // Intercept bookings request
    cy.intercept('GET', '**/api/bookings/user/*', (req) => {
      bookingsRequestCount++;
      if (bookingsRequestCount === 1) {
        // First attempt: Fail with 401
        req.reply({
          statusCode: 401,
          body: { error: 'Token expired' }
        });
      } else {
        // Second attempt: Success
        req.reply({
          statusCode: 200,
          body: [] // Empty bookings list
        });
      }
    }).as('getBookings');

    // Intercept refresh token request
    cy.intercept('POST', '**/api/users/refresh-token', (req) => {
      req.reply({
        statusCode: 200,
        body: { accessToken: 'new-mocked-access-token' }
      });
    }).as('refreshToken');

    // 3. Trigger the flow by visiting bookings page
    cy.visit('/bookings');

    // 4. Verification
    // Should see the refresh token call
    cy.wait('@refreshToken').its('response.statusCode').should('eq', 200);

    // Should see the bookings call succeed eventually (the retry)
    cy.wait('@getBookings').then(() => {
       // We might catch the first one here, need to wait again for the second if strictly sequential
       // or we can verify the total count later.
    });
    
    // Since we wait for @refreshToken, the retry happens inside the axios interceptor *after* that.
    // So we wait for @getBookings again to catch the retry.
    cy.wait('@getBookings').its('response.statusCode').should('eq', 200);

    // Verify the new token is used? 
    // The axios interceptor updates the header.
    // We can check if localStorage was updated if the app does that (api.js line 118 does: localStorage.setItem('accessToken', accessToken);)
    cy.window().then((window) => {
      expect(window.localStorage.getItem('accessToken')).to.eq('new-mocked-access-token');
    });

    // Verify UI shows no error (empty list)
    cy.contains('Chưa có vé đặt').should('be.visible'); // "No bookings" message from translation
  });
});