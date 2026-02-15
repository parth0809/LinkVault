LinkVault 

A full-stack app to securely share either plain text or files using expiring links.

Design Decisions
Tokenized share links: Each upload gets a random shareToken (generated with crypto) so links are hard to guess and can be shared directly.
Single-share content model: One upload stores either text or one file (not both), which simplifies retrieval logic and avoids ambiguous share behavior.
MongoDB + Mongoose: Chosen for fast iteration with flexible schema fields like expiresAt, maxViews, maxDownloads, and optional password flags.
Expiry by data + cleanup job: Expiry is enforced at access time and also cleaned in background with a cron job, so expired items are both inaccessible and eventually removed from storage.
Cookie-based JWT auth for owner actions: Auth is used for creating/listing/deleting a user’s own uploads, while shared links remain accessible by token (and optional password) for recipients.
Separate endpoints for view/unlock/download: Kept explicit routes for read, unlock, and file download to keep API behavior predictable and easier to validate.
Validation on both layers: Frontend validates basic inputs for user feedback, while backend performs authoritative validation for security and correctness.
Disk-based file storage (local): Multer stores files in local uploads/ for simplicity in development; metadata is saved in DB for retrieval and cleanup.

Features

User signup and login with JWT-based auth
Upload either text or a file (mutually exclusive)
Shareable tokenized links
Optional link password protection
Expiry support for links
Max views limit for text links
Max downloads limit for file links
Auto cleanup of expired uploads via cron job
Dashboard to view and delete your own uploads

Tech Stack

Frontend: React , React Router, Tailwind CSS
Backend: Node.js, Express, MongoDB, Mongoose
Auth/Security: JWT, bcrypt, cookie-based token transport
File handling: Multer

Project Structure

├── backend
│   ├── app.js
│   ├── index.js
│   ├── .env
│   ├── Uploads
│   │   └── files
│   └── src
│       ├── config
│       │   └── db.js
│       ├── controllers
│       │   ├── auth.controllers.js
│       │   ├── shareControllers.js
│       │   └── upload.controllers.js
│       ├── jobs
│       │   └── cron.jobs.js
│       ├── middleware
│       │   ├── auth.middleware.js
│       │   └── upload.middleware.js
│       ├── models
│       │   ├── Upload.js
│       │   └── user.js
│       └── routes
│           ├── auth.routes.js
│           ├── share.routes.js
│           └── upload.routes.js
│
└── frontend
    └── src
        ├── App.js          // once authenticated share form
        ├── AuthPage.js     // login/signup form
        ├── share.js        // upload data form
        └── sharepage.js    // open shared links

Prerequisites

Node.js
npm
MongoDB instance .

Backend Setup

1. Go to backend:
   cd backend
2. Install dependencies:
   npm install
3. Create a .env file in backend/:
   MONGO_URI=MONGO_URL
   JWT_SECRET=replace_with_a_strong_secret
   PORT=5000
4. Start backend:
   npm start

Backend runs on http://localhost:5000 by default.

Frontend Setup

1. Go to frontend:
   cd frontend

2. Install dependencies:
   npm install

3. Start frontend:
   npm start

Frontend runs on http://localhost:3000 by default.

Auth Behavior

POST /login and POST /signup return a JWT token.
Frontend stores token in browser cookie (token) and sends it to protected endpoints.
Protected routes on backend read token from cookies.

Main API Endpoints

POST /signup - create account
POST /login - authenticate user
POST /upload - create text/file share (auth required)
GET /my-uploads - list current user's uploads (auth required)
DELETE /upload/:id - delete one upload (auth required)
GET /share/:token - view shared text/file metadata
POST /share/:token/unlock - unlock password-protected shared content
GET /share/:token/download - download shared file
POST /share/:token/download/unlock - unlock and download protected file

Upload Rules

You must provide either:
text, or
file
Sending both text and file in one request is rejected.
Max file size: 50 MB
Allowed file MIME types:
    application/pdf
    image/png
    image/jpeg
    image/jpg
    video/mp4
    application/zip
    text/plain

Cleanup Job

A cron job runs every minute.
Expired uploads are removed from MongoDB.
If the upload contains a file, the file is also deleted from disk.
