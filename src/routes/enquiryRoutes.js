import express from 'express';
import { body } from 'express-validator';
import {
  createPublicEnquiry,
  getPublicEnquiries,
  getMyEnquiries,
  claimEnquiry,
} from '../controllers/enquiryController.js';
import auth from '../middleware/auth.js';
import { validateRequest } from '../utils/validators.js';
import { publicEnquiryLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/enquiries/public - Create public enquiry (no auth required, rate limited)
router.post(
  '/public',
  publicEnquiryLimiter, // Rate limit: 10 requests per hour per IP
  [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .trim(),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('phone')
      .optional()
      .trim(),
    body('course_interest')
      .optional()
      .trim(),
    body('message')
      .optional()
      .trim(),
  ],
  validateRequest,
  createPublicEnquiry
);

// GET /api/enquiries/public - Get unclaimed enquiries (protected)
router.get('/public', auth, getPublicEnquiries);

// GET /api/enquiries/mine - Get enquiries claimed by current user (protected)
router.get('/mine', auth, getMyEnquiries);

// POST /api/enquiries/claim/:id - Claim an enquiry (protected)
router.post('/claim/:id', auth, claimEnquiry);

export default router;

