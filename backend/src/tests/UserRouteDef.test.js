
jest.mock('../interfaces/http/controllers/UserController');
jest.mock('../infrastructure/repositories/MongoUserRepository');
jest.mock('../infrastructure/repositories/MongoRefreshTokenRepository');
jest.mock('../application/UserService');
jest.mock('../application/AuthService');
jest.mock('../application/OTPService');
jest.mock('../infrastructure/EmailService');
jest.mock('../interfaces/http/middleware/auth', () => ({
    authenticate: (req, res, next) => next(),
    authorizeAdmin: (req, res, next) => next()
}));
jest.mock('../interfaces/http/middleware/validation', () => ({
    registerValidationRules: () => [],
    loginValidationRules: () => [],
    validate: (req, res, next) => next()
}));

describe('User Routes', () => {
    let router;
    
    beforeAll(() => {
        // dynamic require to ensure mocks are used
        router = require('../interfaces/http/routes/users');
    });

    it('should have POST /resend-verification-otp', () => {
        const route = router.stack.find(layer => {
            if (layer.route) {
                return layer.route.path === '/resend-verification-otp' && layer.route.methods.post;
            }
            return false;
        });
        
        expect(route).toBeDefined();
    });
});
