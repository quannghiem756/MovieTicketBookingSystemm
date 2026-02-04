describe('Booking Journey Demo', () => {
  before(() => {
    // Seed the database with consistent demo data
    cy.exec('npm run seed-demo', { cwd: '../backend', failOnNonZeroExit: false });
  });

  it('completes a full booking journey with a pre-verified user', () => {
    // 1. Login
    cy.visit('/login');
    cy.get('input[name="email"]').demoType('demo@example.com');
    cy.get('input[name="password"]').demoType('demo123');
    cy.get('button[type="submit"]').demoClick();

    // Verify login success
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.wait(1000);

    // 2. Select a Movie from Home Page
    cy.contains('The Quantum Paradox').should('be.visible').wait(1000);
    cy.get('a[href*="/movie/"]').first().demoClick({ force: true });

    // 3. Select Showtime on Movie Details Page
    cy.url().should('include', '/movie/');
    cy.contains('h1', 'The Quantum Paradox', { timeout: 10000 }).should('be.visible');
    
    // Use the "Book Ticket" button in the header as a shortcut
    // It should be enabled if showtimes are available
    cy.wait(2000); // Wait for showtimes to load
    cy.contains('button', /Book Ticket|Đặt vé/, { timeout: 15000 }).demoClick();

    // 4. Seat Selection
    cy.url().should('include', '/book/');
    cy.wait(3000); 
    
    // Select seats in Row C
    cy.get('div').contains('C').parent().within(() => {
        cy.get('div').contains('5').demoClick();
        cy.get('div').contains('6').demoClick();
    });
    
    // 6. Select Payment Method & Confirm
    cy.contains(/Cash|Tiền mặt/).demoClick();
    cy.get('button').contains(/Confirm Booking|Xác nhận đặt vé/).demoClick();

    // 7. Verification
    cy.url().should('include', '/booking/confirmation', { timeout: 15000 });
    cy.contains(/Booking Successful|Đặt vé thành công/).should('be.visible');
    
    cy.wait(3000);
  });
});
