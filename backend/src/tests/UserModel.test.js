const mongoose = require('mongoose');
const User = require('../infrastructure/UserModel');

describe('User Model Schema', () => {
  it('should accept "staff" as a valid role', () => {
    const user = new User({
      name: 'Test Staff',
      email: 'staff@test.com',
      role: 'staff'
    });

    const error = user.validateSync();
    // If 'staff' is valid, error should be undefined (or at least not a validation error on 'role')
    expect(error).toBeUndefined();
  });

  it('should fail for invalid roles', () => {
    const user = new User({
      name: 'Test Invalid',
      email: 'invalid@test.com',
      role: 'superadmin' // invalid role
    });

    const error = user.validateSync();
    expect(error.errors['role']).toBeDefined();
  });
});
