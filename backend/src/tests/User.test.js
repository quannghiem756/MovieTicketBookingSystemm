const User = require('../domain/User');

describe('User Domain Logic', () => {
  describe('calculateAge', () => {
    it('should calculate age correctly', () => {
      const today = new Date();
      // 20 years ago
      const birthDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
      const user = new User('1', 'Test', 'test@test.com', '123', 'hash', birthDate, 0);
      expect(user.calculateAge()).toBe(20);
    });

    it('should return 0 if birthdate is today', () => {
        const today = new Date();
        const user = new User('1', 'Test', 'test@test.com', '123', 'hash', today, 0);
        expect(user.calculateAge()).toBe(0);
    });
  });

  describe('canBookMovie', () => {
    // Helper to mock age for testing rating logic independently of date math
    const createUserWithAge = (age) => {
        const u = new User('x', 'x', 'x', 'x', 'x', new Date(), 0);
        u.calculateAge = () => age;
        return u;
    };

    const user10 = createUserWithAge(10);
    const user12 = createUserWithAge(12);
    const user13 = createUserWithAge(13);
    const user15 = createUserWithAge(15);
    const user16 = createUserWithAge(16);
    const user17 = createUserWithAge(17);
    const user18 = createUserWithAge(18);

    it('should allow everyone for P', () => {
        expect(user10.canBookMovie('P')).toBe(true);
        expect(user18.canBookMovie('P')).toBe(true);
    });

    it('should allow everyone for K (restriction is soft/warning)', () => {
        expect(user10.canBookMovie('K')).toBe(true);
        expect(user18.canBookMovie('K')).toBe(true);
    });

    it('should restrict C13', () => {
        expect(user12.canBookMovie('C13')).toBe(false);
        expect(user13.canBookMovie('C13')).toBe(true);
    });

    it('should restrict C16', () => {
        expect(user15.canBookMovie('C16')).toBe(false);
        expect(user16.canBookMovie('C16')).toBe(true);
    });

    it('should restrict C18', () => {
        expect(user17.canBookMovie('C18')).toBe(false);
        expect(user18.canBookMovie('C18')).toBe(true);
    });
  });
});
