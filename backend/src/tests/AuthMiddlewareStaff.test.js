const httpMocks = require('node-mocks-http');

describe('Auth Middleware - Staff', () => {
    let req, res, next, authorizeStaff;

    beforeEach(() => {
        jest.resetModules();
        
        // Mock dependencies to allow the file to load
        jest.mock('../application/AuthService', () => jest.fn());
        jest.mock('../application/UserService', () => jest.fn());
        jest.mock('../infrastructure/repositories/MongoUserRepository', () => jest.fn());
        jest.mock('../infrastructure/repositories/MongoRefreshTokenRepository', () => jest.fn());

        try {
             ({ authorizeStaff } = require('../interfaces/http/middleware/auth'));
        } catch (e) {
            // function might not exist yet
        }
        
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should be defined', () => {
        expect(authorizeStaff).toBeDefined();
    });

    it('should allow staff user', () => {
        if (!authorizeStaff) return; // Skip if not defined (fail via first test)
        req.user = { role: 'staff' };
        authorizeStaff(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should allow admin user (admins imply staff access)', () => {
        if (!authorizeStaff) return;
        req.user = { role: 'admin' };
        authorizeStaff(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should reject standard user', () => {
        if (!authorizeStaff) return;
        req.user = { role: 'user' };
        authorizeStaff(req, res, next);
        expect(res.statusCode).toBe(403);
    });
});
