# CampusConnect — Full-Stack Placement Portal

A learning/demo project using React, Vite, Node.js, Express, MongoDB, and JWT.

## Features
- Student registration and login
- JWT-protected student and admin APIs
- Browse/search placement opportunities
- Apply with required contact details, resume upload (PDF/DOC/DOCX up to 5 MB), and optional cover letter
- Prevent duplicate applications and mark jobs already applied to
- Save/unsave favorite jobs in the student browser
- Track application statuses (Applied, Under Review, Shortlisted, Rejected, Selected)
- Admin can review applicant details, update status, and download resumes
- Admin job CRUD (create, edit, delete)
- MongoDB persistence
- Seed script to create a demo admin and sample jobs

## Requirements
- Node.js 18+
- MongoDB Community running locally, or a MongoDB Atlas connection string
- VS Code

## 1. Backend setup
Open a terminal in `backend`:

```bash
npm install
```

On Windows PowerShell where script execution blocks `npm.ps1`, use `npm.cmd` instead of `npm` in these commands.

Copy `.env.example` to `.env` and edit `MONGO_URI` and `JWT_SECRET`. If you already have a working `.env` from the previous CampusConnect folder, copy it into this `backend` folder instead of replacing it.

```bash
npm run seed
npm run dev
```

Backend runs at `http://localhost:5000`. API health check: `http://localhost:5000/api/health`.

Demo admin after seeding:
- Email: `admin@campusconnect.demo`
- Password: `Admin123!`

Change the demo password and JWT secret before using this outside a local demo.

## 2. Frontend setup
Open a second terminal in `frontend`:

```bash
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd install` and `npm.cmd run dev` if `npm` is blocked by the execution policy.

Open the URL Vite prints (usually `http://localhost:5173`).

## 3. Student demo
Register a student account from the UI, log in, browse jobs, apply, and check My Applications.

## 4. Admin demo
Log in with the seeded admin account. Open Admin to add, edit, or delete jobs.

## Project structure
```text
CampusConnect/
  backend/
    src/
      config/db.js
      middleware/auth.js
      models/User.js
      models/Job.js
      models/Application.js
      routes/auth.js
      routes/jobs.js
      routes/applications.js
      server.js
    scripts/seed.js
    .env.example
    package.json
  frontend/
    src/
      components/NavBar.jsx
      context/AuthContext.jsx
      pages/Login.jsx
      pages/Register.jsx
      pages/Jobs.jsx
      pages/MyApplications.jsx
      pages/Admin.jsx
      App.jsx
      main.jsx
      styles.css
    index.html
    package.json
    vite.config.js
```

## API overview
- `POST /api/auth/register` — create student account
- `POST /api/auth/login` — get JWT
- `GET /api/jobs` — list/search jobs (public)
- `POST /api/jobs` — create job (admin only)
- `PUT /api/jobs/:id` — update job (admin only)
- `DELETE /api/jobs/:id` — delete job (admin only)
- `POST /api/applications/:jobId` — apply (student only)
- `GET /api/applications/mine` — current student's applications

## Important notes
- This is a portfolio/learning starter, not a production-ready recruitment system.
- The demo uses a simple admin role. Add email verification, password reset, rate limiting, audit logs, stronger validation, and deployment secrets before production.
- Never commit `.env` or real credentials to GitHub.


## Job applications and resumes
Students click **Apply now** to open an application form. Name, email, department, and graduation year are prefilled from the account where available; applicants can review/edit them and provide a phone number, resume (PDF/DOC/DOCX up to 5 MB), and optional cover letter. Resume files are stored in `backend/uploads` for this local demo. Admins can download a submitted resume from the Applications tab. Keep the backend running while using this feature.

For this updated version, run `npm.cmd install` inside both `backend` and `frontend`, then restart both development servers. Existing MongoDB data remains in your local MongoDB database when you keep the same `MONGO_URI`. Do not delete your existing `.env`; copy its values into the updated backend folder if you use a fresh project folder.

Saved jobs are stored in the student browser only. Applications and status changes are stored in MongoDB. Resume upload checks the file extension, reported MIME type, basic file signature, and 5 MB limit. This is still a local learning/demo project; use private file storage, malware scanning, rate limiting, and stricter production security before public deployment.
