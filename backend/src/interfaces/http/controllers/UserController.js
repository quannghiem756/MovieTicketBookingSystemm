const UserService = require('../../../application/UserService');
const AuthService = require('../../../application/AuthService');

class UserController {
  constructor(userService, authService) {
    this.userService = userService;
    this.authService = authService;
  }

  async createUser(req, res) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      // Check if it's a duplicate email error
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserByEmail(req, res) {
    try {
      const user = await this.userService.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await this.userService.deleteUser(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async authenticateUser(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.authenticateUser(email, password);
      console.log('AuthService result:', result); // Debug log
      if (!result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      const tokens = await this.authService.refreshTokens(refreshToken);
      res.json(tokens);
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }
}

module.exports = UserController;