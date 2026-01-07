const UserController = require('../interfaces/http/controllers/UserController');
const httpMocks = require('node-mocks-http');

describe('AdminUserManagement', () => {
  let userController;
  let mockUserService;
  let mockAuthService;

  beforeEach(() => {
    mockUserService = {
        createUser: jest.fn(),
        updateUser: jest.fn(),
        getUserById: jest.fn()
    };
    mockAuthService = {}; // Not needed for these tests
    userController = new UserController(mockUserService, mockAuthService);
  });

  describe('createUserByAdmin', () => {
    it('should allow admin to create a staff user', async () => {
        const userData = { name: 'Staff', email: 'staff@test.com', role: 'staff', password: 'pw' };
        const req = httpMocks.createRequest({ 
            method: 'POST', 
            body: userData,
            user: { role: 'admin' } // Authenticated as admin
        });
        const res = httpMocks.createResponse();

        mockUserService.createUser.mockResolvedValue({ id: 's1', ...userData });

        // This method doesn't exist yet, so it will fail
        if (!userController.createUserByAdmin) {
            throw new Error('createUserByAdmin not implemented');
        }
        await userController.createUserByAdmin(req, res);

        expect(res.statusCode).toBe(201);
        expect(mockUserService.createUser).toHaveBeenCalledWith({ ...userData, isVerified: true }, true); // true for isAdmin context
        const data = JSON.parse(res._getData());
        expect(data.role).toBe('staff');
    });
  });

  describe('updateUser Security', () => {
    it('should prevent regular user from updating role', async () => {
        const req = httpMocks.createRequest({ 
            method: 'PUT', 
            params: { id: 'u1' }, 
            body: { role: 'admin' },
            user: { id: 'u1', role: 'user' } // Regular user updating themselves
        });
        const res = httpMocks.createResponse();

        await userController.updateUser(req, res);

        // Expectation: 403 Forbidden
        expect(res.statusCode).toBe(403);
        expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });

    it('should prevent regular user from updating another user', async () => {
        const req = httpMocks.createRequest({ 
            method: 'PUT', 
            params: { id: 'u2' }, // Different ID
            body: { name: 'Hacker' },
            user: { id: 'u1', role: 'user' }
        });
        const res = httpMocks.createResponse();

        await userController.updateUser(req, res);

        expect(res.statusCode).toBe(403);
        expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });

    it('should allow admin to update any user and role', async () => {
        const req = httpMocks.createRequest({ 
            method: 'PUT', 
            params: { id: 'u2' }, 
            body: { role: 'staff' },
            user: { id: 'a1', role: 'admin' }
        });
        const res = httpMocks.createResponse();

        mockUserService.updateUser.mockResolvedValue({ id: 'u2', role: 'staff' });

        await userController.updateUser(req, res);

        expect(res.statusCode).toBe(200);
        expect(mockUserService.updateUser).toHaveBeenCalled();
    });
  });
});
