import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize, User, Enquiry } from './models/index.js';

/**
 * Seed script to populate database with sample data
 * Creates 2 users and 5 sample enquiries (some claimed, some unclaimed)
 */
async function seed() {
  try {
    // Sync database (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Enquiry.destroy({ where: {} });
    await User.destroy({ where: {} });
    console.log('Cleared existing data');

    // Hash password for users
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    // Create users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
    });

    console.log('Created users:', user1.email, user2.email);

    // Create enquiries
    const enquiries = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1234567890',
        course_interest: 'Web Development',
        message: 'Interested in learning full-stack development',
        claimed_by: null, // Unclaimed
      },
      {
        name: 'Bob Williams',
        email: 'bob@example.com',
        phone: '+1234567891',
        course_interest: 'Data Science',
        message: 'Want to learn Python and machine learning',
        claimed_by: user1.id, // Claimed by user1
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        phone: '+1234567892',
        course_interest: 'Mobile Development',
        message: 'Looking for React Native course',
        claimed_by: null, // Unclaimed
      },
      {
        name: 'Diana Prince',
        email: 'diana@example.com',
        phone: '+1234567893',
        course_interest: 'UI/UX Design',
        message: 'Interested in design courses',
        claimed_by: user2.id, // Claimed by user2
      },
      {
        name: 'Edward Norton',
        email: 'edward@example.com',
        phone: '+1234567894',
        course_interest: 'DevOps',
        message: 'Want to learn Docker and Kubernetes',
        claimed_by: null, // Unclaimed
      },
    ];

    for (const enquiryData of enquiries) {
      await Enquiry.create(enquiryData);
    }

    console.log(`Created ${enquiries.length} enquiries`);
    console.log('\nSeed completed successfully!');
    console.log('\nTest credentials:');
    console.log('User 1: john@example.com / password123');
    console.log('User 2: jane@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

// Run seed
seed();
