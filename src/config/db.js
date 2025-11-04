import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Sequelize with SQLite database
// Database file will be created in project root as 'database.sqlite'
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: join(__dirname, '../../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Log queries in development
});

// Sync helper for development
// Use sequelize.sync({ alter: true }) to sync models with database schema
// This will update existing tables to match model definitions without dropping data
// For production, use migrations instead (sequelize-cli)

export default sequelize;

