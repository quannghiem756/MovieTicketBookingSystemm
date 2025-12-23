const rateLimit = require('express-rate-limit');

// Rate limiter for seat holding (prevent spam)
const seatHoldLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 hold requests per minute
  message: {
    error: 'Too many seat requests, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  seatHoldLimiter
};