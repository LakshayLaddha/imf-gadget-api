# IMF Gadget API

A secure API for managing IMF gadgets with JWT authentication, built with Node.js, Express, and PostgreSQL.

## Features

- JWT Authentication & Authorization
- CRUD operations for gadgets
- Self-destruct functionality
- Mission success probability calculation
- Unique codename generation
- Soft delete (decommission) instead of hard delete
- Swagger API documentation
- Rate limiting and security headers

## Tech Stack

- Node.js & Express
- PostgreSQL with Sequelize ORM
- JWT for authentication
- Swagger for API documentation
- Helmet for security headers
- bcrypt for password hashing

## Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd imf-gadget-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database

4. Create `.env` file with your configuration:
```
DATABASE_URL=postgresql://username:password@localhost:5432/imf_gadgets
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=3000
```

5. Create database and run migrations:
```bash
npm run db:create
npm run db:migrate
npm run db:seed
```

6. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Gadgets (Requires Authentication)
- `GET /api/gadgets` - Get all gadgets (with optional status filter)
- `POST /api/gadgets` - Create new gadget (Admin only)
- `PATCH /api/gadgets/:id` - Update gadget (Admin only)
- `DELETE /api/gadgets/:id` - Decommission gadget (Admin only)
- `POST /api/gadgets/:id/self-destruct` - Trigger self-destruct

## Default Users

- Admin: `username: admin`, `password: admin123`
- Agent: `username: agent007`, `password: agent123`

## API Documentation

Swagger documentation available at: `http://localhost:3000/api-docs`

## Testing with Postman

1. Import the provided Postman collection
2. Set up environment variables:
   - `base_url`: http://localhost:3000/api
   - `token`: JWT token from login
3. Login as admin first to get token
4. Use Bearer token authentication for protected endpoints

## Deployment

### Deploy to Render (Recommended - Free Tier)

1. Push code to GitHub
2. Sign up at [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Configure environment variables
6. Deploy

### Deploy to Railway

1. Install Railway CLI
2. Run `railway login`
3. Run `railway init`
4. Add PostgreSQL: `railway add`
5. Deploy: `railway up`

### Deploy to Heroku

1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
4. Deploy: `git push heroku main`

## Security Features

- JWT authentication with 24h expiration
- Password hashing with bcrypt (10 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS enabled
- Helmet security headers
- Input validation
- Role-based authorization (admin/agent)

## License

Created for Upraised Backend Developer Intern Assignment