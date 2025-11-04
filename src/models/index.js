import sequelize from '../config/db.js';
import User from './user.js';
import Enquiry from './enquiry.js';

// Define associations
// Enquiry belongs to User (via claimed_by foreign key)
Enquiry.belongsTo(User, {
  foreignKey: 'claimed_by',
  as: 'claimer',
});

// Export models and sequelize instance
export {
  sequelize,
  User,
  Enquiry,
};
