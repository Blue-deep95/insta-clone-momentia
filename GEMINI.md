# Insta-clone (Momentia) Project Context

This project is a full-stack social media application (Instagram clone) built with the MERN stack.

## Project Overview

*   **Architecture:** Monorepo-style structure with separate `backend` and `frontend` directories.
*   **Backend:** Node.js, Express, MongoDB (via Mongoose).
*   **Frontend:** React 19, Vite, Tailwind CSS 4, Redux Toolkit, React Router 7.
*   **Authentication:** JWT-based authentication with access and refresh tokens.
*   **Media Storage:** Cloudinary for image uploads and transformations.
*   **Emails:** NodeMailer for system emails (e.g., OTP for email verification).

## Foundational Documents

- **Project Design & Styling:** Refer to [DESIGN.md](./DESIGN.md) for the brand's visual language, color palettes, and UI component standards only if it exists.
- **Agent Instructions:** Refer to [AGENTS.md](./AGENTS.md) for behavior and tool usage rules only if it exists.
- **API Documentation:** Refer to [API.md](./API.md) for proper API usage when working on frontend only if it exists.


## Building and Running

### Prerequisites
*   Node.js installed.
*   MongoDB instance (local or Atlas).
*   Cloudinary account for image handling.

### Backend
1.  Navigate to `backend/`.
2.  Install dependencies: `npm install`.
3.  Configure `.env` file (see `backend/index.js` and `backend/db/db.js` for required variables like `MONGODB_URL`, `JWT_ACCESS_TOKEN`, `JWT_REFRESH_TOKEN`).
4.  Run the server: `npm start` (starts with `nodemon`).
5.  Default Port: `2000`.

### Frontend
1.  Navigate to `frontend/`.
2.  Install dependencies: `npm install`.
3.  Run the development server: `npm run dev`.
4.  Default Port: `5173`.

## Development Conventions

### Backend
*   **Module System:** CommonJS (`require`/`module.exports`).
*   **Routing:** Organized in `backend/routes/`. Routes are mounted in `index.js`.
*   **Middleware:** Custom middleware (like `authMiddleware.js`) is used for request protection.
*   **Models:** Mongoose schemas are located in `backend/models/`.
*   **Security:** CORS is configured in `index.js`. Sensitive keys must be in `.env`.

### Frontend
*   **Module System:** ESM (`import`/`export`).
*   **State Management:** Redux Toolkit is used. Slices are in `frontend/src/slices/` and the store is in `frontend/src/store/`.
*   **Styling:** Tailwind CSS 4. Utility-first approach.
*   **Routing:** React Router 7. Defined in `frontend/src/App.jsx`.
*   **API Calls:** Centralized in `frontend/src/services/api.js`.

### General
*   **Validation:** Use idiomatic patterns for each stack (e.g., Mongoose schema validation on backend).
*   **Testing:** No explicit test suites found yet; TODO: Add unit and integration tests.


