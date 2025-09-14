const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const registerValidationRules = () => {
  return [
    // Name validation
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),

    // Email validation
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),

    // Password validation
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    // Password confirmation validation
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),

    // Phone validation (optional)
    body('phone')
      .optional({ checkFalsy: true })
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),

    // Date of birth validation (optional)
    body('dateOfBirth')
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage('Please provide a valid date of birth')
      .custom((value) => {
        const date = new Date(value);
        const today = new Date();
        const minAgeDate = new Date();
        minAgeDate.setFullYear(today.getFullYear() - 13); // Minimum age of 13
        
        if (date > minAgeDate) {
          throw new Error('You must be at least 13 years old');
        }
        
        const maxAgeDate = new Date();
        maxAgeDate.setFullYear(today.getFullYear() - 120); // Maximum age of 120
        
        if (date < maxAgeDate) {
          throw new Error('Please provide a valid date of birth');
        }
        
        return true;
      })
  ];
};

// Validation rules for login
const loginValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ];
};

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validate
};