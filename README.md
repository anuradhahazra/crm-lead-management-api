# 🚀 CRM Lead Management API

A modern, ES6-based REST API for managing customer enquiries and leads. Built with Express, SQLite, and JWT authentication. Perfect for handling lead generation, assignment, and tracking in a CRM workflow.

## ✨ What's Inside

This API handles the core workflow of a lead management system:

- **User Authentication** - Secure JWT-based auth system
- **Public Enquiry Submission** - Let visitors submit enquiries (with rate limiting to prevent abuse)
- **Lead Claiming** - Team members can claim unclaimed enquiries atomically
- **Pagination** - Efficient data fetching for large datasets
- **Input Validation** - Robust validation on all endpoints
- **Error Handling** - Clean, consistent error responses

## 🛠️ Tech Stack

Built with modern JavaScript (ES6 modules) and battle-tested libraries:

- **Node.js** + **Express** - Fast, minimal web framework
- **Sequelize** + **SQLite** - Lightweight ORM with file-based database (perfect for development)
- **JWT** - Stateless authentication tokens
- **bcryptjs** - Secure password hashing
- **express-validator** - Request validation middleware
- **express-rate-limit** - Protection against abuse

## 🏃‍♂️ Quick Start

### Prerequisites

You'll need Node.js (v14+) and npm installed. That's it!

### Installation

```bash
# Clone and install dependencies
npm install
```

### Configuration

Create a `.env` file in the root directory (you can copy from `.env.example`):

```env
PORT=4000
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
NODE_ENV=development
```

**⚠️ Important:** Change `JWT_SECRET` to something secure before deploying! A weak secret compromises your entire authentication system.

### Database Setup

The database creates itself automatically when you first run the app. But if you want some sample data to play around with:

```bash
npm run seed
```

This populates your database with:
- 2 test users (john@example.com / jane@example.com, both with password: `password123`)
- 5 sample enquiries (mix of claimed and unclaimed)

### Running the Server

**Development mode** (auto-reloads on file changes):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will fire up on `http://localhost:4000`. You should see a log message confirming it's running.

### Quick Test

Hit the test endpoint to make sure everything's working:

```bash
curl http://localhost:4000/api/test
```

You should get back: `{"message":"Server running successfully"}`

## 📡 API Endpoints

### Authentication

#### Register a New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Returns user info (without the password, obviously).

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Returns a JWT token and user info. **Save that token** - you'll need it for protected routes!

### Enquiries

#### Create Public Enquiry
Anyone can submit an enquiry (no auth needed):

```bash
POST /api/enquiries/public
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+1234567890",
  "course_interest": "Web Development",
  "message": "Interested in learning full-stack development"
}
```

**Note:** This endpoint is rate-limited to 10 requests per hour per IP address to prevent spam.

#### Get Unclaimed Enquiries
Get a paginated list of enquiries that haven't been claimed yet:

```bash
GET /api/enquiries/public?page=1&limit=20
Authorization: Bearer <your_jwt_token>
```

Query params:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

Response includes pagination metadata:
```json
{
  "data": [...],
  "page": 1,
  "total": 15,
  "totalPages": 1
}
```

#### Get My Enquiries
See all the enquiries you've claimed:

```bash
GET /api/enquiries/mine
Authorization: Bearer <your_jwt_token>
```

#### Claim an Enquiry
Claim an unclaimed enquiry for yourself (atomic operation - prevents race conditions):

```bash
POST /api/enquiries/claim/:id
Authorization: Bearer <your_jwt_token>
```

Returns the updated enquiry if successful, or an error if:
- The enquiry doesn't exist (404)
- The enquiry is already claimed (400)

### Health Check

```bash
GET /
```

Basic health check endpoint. Returns server status and timestamp.

## 🧪 Testing with cURL

Here's a quick walkthrough to test the API:

### 1. Register a user
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### 2. Login and grab your token
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

Copy the `token` from the response.

### 3. Create a public enquiry (no auth needed)
```bash
curl -X POST http://localhost:4000/api/enquiries/public \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+1234567890",
    "course_interest": "Web Development",
    "message": "Interested in learning full-stack development"
  }'
```

### 4. Get public enquiries (with your token)
```bash
curl -X GET "http://localhost:4000/api/enquiries/public?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Claim an enquiry
```bash
curl -X POST http://localhost:4000/api/enquiries/claim/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📁 Project Structure

```
crm-lead-management-api/
├── server.js                    # Main entry point (ES6 modules)
├── db/
│   └── index.js                 # Sequelize database configuration
├── src/
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── enquiryController.js # Enquiry operations
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── rateLimiter.js       # Rate limiting config
│   ├── models/
│   │   ├── index.js             # Model exports & associations
│   │   ├── user.js              # User model
│   │   └── enquiry.js           # Enquiry model
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   └── enquiries.js         # Enquiry routes
│   ├── utils/
│   │   └── validators.js        # Validation helpers
│   └── seed.js                  # Database seeding script
├── .env.example                 # Environment variables template
├── database.sqlite             # SQLite database (auto-created)
└── package.json
```

**Note:** This project uses ES6 modules (`import`/`export`), so all file imports require the `.js` extension.

## 🗄️ Database Models

### User
Basic user model for authentication:
- `id` - Auto-incrementing primary key
- `name` - User's full name
- `email` - Unique email address (used for login)
- `password` - Bcrypt-hashed password
- `createdAt` / `updatedAt` - Automatic timestamps

### Enquiry
Represents a lead/enquiry:
- `id` - Auto-incrementing primary key
- `name` - Enquirer's name
- `email` - Contact email
- `phone` - Optional phone number
- `course_interest` - Optional field for course interest
- `message` - Optional message/notes
- `claimed_by` - Foreign key to User (null if unclaimed)
- `createdAt` / `updatedAt` - Automatic timestamps

**Relationship:** Each enquiry can belong to one user (the person who claimed it).

## 🔒 Security Features

- **Password Hashing** - Passwords are hashed with bcrypt (10 salt rounds) before storage
- **JWT Authentication** - Stateless tokens with 24-hour expiration
- **Rate Limiting** - Public enquiry endpoint throttled to prevent abuse
- **Input Validation** - All inputs validated with express-validator
- **CORS Enabled** - Configured for cross-origin requests (adjust as needed for production)

## ⚠️ Error Handling

The API follows RESTful conventions and returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created (new resource)
- `400` - Bad Request (validation errors, already claimed, etc.)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

Error responses always include an `error` field with a descriptive message. In development mode, the error handler also returns the error message for debugging.

## 💻 Development Tips

### Database Sync

For development, you can sync models with the database using:

```javascript
await sequelize.sync({ alter: true });
```

**⚠️ Warning:** Don't use `sync()` in production! Use proper migrations instead (Sequelize CLI).

### Available Scripts

- `npm start` - Run the production server
- `npm run dev` - Run with nodemon (auto-reload)
- `npm run seed` - Populate database with sample data

### Environment Variables

| Variable | What It Does | Default |
|----------|--------------|---------|
| `PORT` | Server port | `4000` |
| `JWT_SECRET` | Secret for signing JWT tokens | **Required** |
| `NODE_ENV` | Environment mode | `development` |

## 🤝 Contributing

Found a bug? Have a feature idea? Contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

ISC License - feel free to use this for your projects!

## 🐛 Troubleshooting

**Server won't start?**
- Check that port 4000 isn't already in use
- Make sure your `.env` file exists and has `JWT_SECRET` set

**Database errors?**
- Delete `database.sqlite` and let it recreate on next run
- Run `npm run seed` to repopulate sample data

**Import errors?**
- Make sure you're using Node.js v14+ (ES modules support)
- Check that all imports include the `.js` extension

---

**Built with ❤️ using ES6 modules and modern JavaScript best practices.**
