import { validationResult } from 'express-validator';

/**
 * Express middleware to check express-validator results
 * Returns 400 with error array if validation fails
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { validateRequest };

