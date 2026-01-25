import en from './en';
import vi from './vi';

describe('Translation Keys', () => {
  it('should have authentication error keys in English', () => {
    // These keys don't exist yet, so this test should fail
    expect((en as any).auth.error).toBeDefined();
    expect((en as any).auth.error.fillAll).toBeDefined();
    expect((en as any).auth.error.googleLogin).toBeDefined();
    expect((en as any).auth.error.loginFailed).toBeDefined();
    expect((en as any).auth.error.passwordMismatch).toBeDefined();
    expect((en as any).auth.error.registrationFailed).toBeDefined();
  });

  it('should have profile keys in English', () => {
    expect((en as any).profile.settings).toBeDefined();
    expect((en as any).profile.language).toBeDefined();
    expect((en as any).profile.helpSupport).toBeDefined();
    expect((en as any).profile.bookingPrefix).toBeDefined();
    expect((en as any).profile.status.confirmed).toBeDefined();
  });

  it('should have movie keys in English', () => {
    expect((en as any).movies.noResultsSubtitle).toBeDefined();
    expect((en as any).movies.askAI).toBeDefined();
    expect((en as any).movies.notFound).toBeDefined();
    expect((en as any).movies.showtimes).toBeDefined();
    expect((en as any).movies.noShowtimes).toBeDefined();
    expect((en as any).movies.synopsis).toBeDefined();
    expect((en as any).movies.director).toBeDefined();
    expect((en as any).movies.cast).toBeDefined();
    expect((en as any).movies.selectShowtime).toBeDefined();
    expect((en as any).movies.bookFor).toBeDefined();
    expect((en as any).movies.durationUnit).toBeDefined();
  });

  it('should have seat selection keys in English', () => {
    expect((en as any).booking.seats.timerExpired).toBeDefined();
    expect((en as any).booking.seats.legend.available).toBeDefined();
    expect((en as any).booking.seats.footer.selected).toBeDefined();
    expect((en as any).booking.seats.confirm).toBeDefined();
  });

  it('should have checkout keys in English', () => {
    expect((en as any).booking.checkout.title).toBeDefined();
    expect((en as any).booking.checkout.promoCode).toBeDefined();
    expect((en as any).booking.checkout.subtotal).toBeDefined();
    expect((en as any).booking.checkout.payWithMomo).toBeDefined();
  });

  it('should have authentication error keys in Vietnamese', () => {
    expect((vi as any).auth.error).toBeDefined();
    expect((vi as any).auth.error.fillAll).toBeDefined();
    // ... check others
  });
});
