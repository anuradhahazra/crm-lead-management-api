import { Enquiry } from '../models/index.js';

/**
 * Create a public enquiry (unclaimed)
 * Inserts new enquiry with claimed_by = null
 */
export const createPublicEnquiry = async (req, res) => {
  try {
    const { name, email, phone, course_interest, message } = req.body;

    // Create enquiry with claimed_by = null
    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      course_interest,
      message,
      claimed_by: null,
    });

    res.status(201).json({
      message: 'Enquiry details submitted successfully.'
    });
  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
};

/**
 * Get all unclaimed enquiries (public) with pagination
 * Returns enquiries where claimed_by is null, ordered by newest first
 * Supports query params: ?page=1&limit=20
 */
export const getPublicEnquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await Enquiry.count({
      where: { claimed_by: null },
    });

    // Get paginated enquiries
    const enquiries = await Enquiry.findAll({
      where: { claimed_by: null },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      data: enquiries,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get public enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch public enquiries' });
  }
};

/**
 * Get enquiries claimed by the current user
 * Returns enquiries where claimed_by matches the authenticated user's id
 */
export const getMyEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll({
      where: { claimed_by: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({ data: enquiries });
  } catch (error) {
    console.error('Get my enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch your enquiries' });
  }
};

/**
 * Claim an enquiry (atomic operation)
 * Updates enquiry with user's id only if it's currently unclaimed
 */
export const claimEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Atomic update: only update if claimed_by is null
    // Using returning: true to get the updated row (works in SQLite via Sequelize)
    // If returning: true is not supported, fallback would use:
    // - Transaction with SELECT FOR UPDATE to lock row
    // - Then UPDATE and SELECT in same transaction
    const [updatedCount, updatedRows] = await Enquiry.update(
      { claimed_by: userId },
      {
        where: {
          id,
          claimed_by: null, // Only claim if currently unclaimed
        },
        returning: true, // Return updated rows
      }
    );

    if (updatedCount === 0) {
      // Check if enquiry exists at all
      const enquiry = await Enquiry.findByPk(id);
      if (!enquiry) {
        return res.status(404).json({ error: 'Enquiry not found' });
      }
      // Enquiry exists but is already claimed
      return res.status(400).json({ error: 'Enquiry already claimed' });
    }

    // Get updated enquiry (fallback if returning: true didn't work)
    let updatedEnquiry = updatedRows && updatedRows[0];
    if (!updatedEnquiry) {
      updatedEnquiry = await Enquiry.findByPk(id);
    }

    // Success - return updated enquiry
    res.json({
      message: 'Enquiry claimed successfully',
      enquiry: updatedEnquiry,
    });
  } catch (error) {
    console.error('Claim enquiry error:', error);
    res.status(500).json({ error: 'Failed to claim enquiry' });
  }
};
