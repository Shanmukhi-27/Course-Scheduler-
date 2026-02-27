# Backend Setup Instructions

## Prerequisites
- Node.js installed (Download from https://nodejs.org/)

## Installation Steps

1. Open Command Prompt in the project folder:
   - Navigate to: `C:\Users\DELL\course scheduler`
   - Or right-click in folder and select "Open in Terminal"

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open browser and go to:
   ```
   http://localhost:3000
   ```

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## Features
✅ Secure login with password hashing (bcrypt)
✅ Session-based authentication
✅ Admin and Student roles
✅ Student registration
✅ Protected routes
✅ Backend API with Express.js

## API Endpoints
- POST /api/login - User login
- POST /api/register - Student registration
- POST /api/logout - Logout
- GET /api/check-auth - Check authentication
- GET /api/courses - Get all courses
- POST /api/courses - Add course (admin only)
- DELETE /api/courses/:id - Delete course (admin only)
- GET /api/my-courses - Get student's enrolled courses
- POST /api/register-course - Register for course
- POST /api/drop-course - Drop course

## Troubleshooting
- If port 3000 is busy, change PORT in server.js
- Make sure Node.js is installed: `node --version`
- Clear browser cache if login issues occur
