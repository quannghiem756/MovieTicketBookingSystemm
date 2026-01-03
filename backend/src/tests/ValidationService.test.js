const ValidationService = require('../application/ValidationService');

describe('ValidationService', () => {
    let validationService;
    const secret = 'test_secret_key';

    beforeEach(() => {
        validationService = new ValidationService(secret);
    });

    it('should generate a signed token containing bookingId', () => {
        const bookingId = 'book123';
        const token = validationService.generateValidationToken(bookingId);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        
        const decoded = validationService.verifyValidationToken(token);
        expect(decoded.bookingId).toBe(bookingId);
    });

    it('should fail for invalid tokens', () => {
        expect(() => {
            validationService.verifyValidationToken('invalid-token');
        }).toThrow();
    });

    it('should fail for tokens signed with different secret', () => {
        const otherService = new ValidationService('wrong_secret');
        const token = otherService.generateValidationToken('book123');
        
        expect(() => {
            validationService.verifyValidationToken(token);
        }).toThrow();
    });
});
