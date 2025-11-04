import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for public enquiry creation endpoint
 * Limits to 10 requests per hour per IP address
 */
const publicEnquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

export { publicEnquiryLimiter };

