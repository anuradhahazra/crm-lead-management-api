import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController.js';
import { validateRequest } from '../utils/validators.js';

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .trim(),
  ],
  validateRequest,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  validateRequest,
  login
);

export default router;

