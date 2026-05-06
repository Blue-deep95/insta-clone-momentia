# Momentia API Documentation

This document provides a comprehensive overview of the Momentia API endpoints, including authentication requirements, request parameters, and response structures.

## Base URL
`http://localhost:2000/api`

## Authentication
The API uses **JWT (JSON Web Tokens)** for authentication.
*   **Access Token:** Must be sent in the `Authorization` header as a Bearer token: `Authorization: Bearer <access_token>`.
*   **Refresh Token:** Handled via HTTP-only cookies (`refreshToken`).

---

## 🔐 User & Authentication (`/user`)

### 1. Send OTP
Sends a verification OTP to the user's email.
*   **URL:** `/user/send-otp`
*   **Method:** `POST`
*   **Body:**
    ```json
    { "email": "user@example.com" }
    ```
*   **Success Response (201):**
    ```json
    { "message": "Email sent successfully" }
    ```

### 2. Verify OTP
Verifies the OTP sent to the user's email.
*   **URL:** `/user/verify-otp`
*   **Method:** `POST`
*   **Body:**
    ```json
    { "email": "user@example.com", "otp": "12345" }
    ```
*   **Success Response (200):**
    ```json
    { "message": "Email Verified" }
    ```

### 3. Register
Registers a new user after email verification.
*   **URL:** `/user/register`
*   **Method:** `POST`
*   **Body:**
    ```json
    { "name": "John Doe", "email": "user@example.com", "password": "password123" }
    ```
*   **Success Response (201):**
    ```json
    { "message": "user created successfully" }
    ```

### 4. Login
Authenticates a user and returns an access token.
*   **URL:** `/user/login`
*   **Method:** `POST`
*   **Body:**
    ```json
    { "email": "user@example.com", "password": "password123" }
    ```
*   **Success Response (200):**
    ```json
    {
      "accessToken": "...",
      "user": { "id": "...", "name": "...", "email": "..." },
      "message": "Login successful"
    }
    ```
*   **Note:** Sets an HTTP-only `refreshToken` cookie.

### 5. Forgot Password
Sends a password reset OTP.
*   **URL:** `/user/forgot-password`
*   **Method:** `POST`
*   **Body:**
    ```json
    { "email": "user@example.com" }
    ```
*   **Success Response (200):**
    ```json
    { "message": "OTP sent to email" }
    ```

### 6. Reset Password
Resets the password using an OTP.
*   **URL:** `/user/reset-password`
*   **Method:** `POST`
*   **Body:**
    ```json
    { "email": "user@example.com", "otp": "123456", "password": "newpassword123" }
    ```
*   **Success Response (200):**
    ```json
    { "message": "Password reset successful" }
    ```

### 7. Regenerate Access Token
Uses the refresh token cookie to issue a new access token.
*   **URL:** `/user/regenerate-access-token`
*   **Method:** `POST`
*   **Success Response (200):**
    ```json
    { "accessToken": "..." }
    ```

### 8. Logout
Invalidates the refresh token and clears the cookie.
*   **URL:** `/user/logout`
*   **Method:** `POST`
*   **Success Response (200):**
    ```json
    { "message": "Logout successful" }
    ```

---

## 👤 Profile (`/profile`)
*All routes in this section require a valid Bearer Token.*

### 1. Get Profile
Retrieves public profile information for a user.
*   **URL:** `/profile/get-profile/:id`
*   **Method:** `GET`
*   **Success Response (200):**
    ```json
    {
      "profile": {
        "username": "...",
        "name": "...",
        "bio": "...",
        "profilePicture": { ... }
      },
      "message": "profile search succesfull"
    }
    ```

### 2. Upload Avatar
Uploads and processes a profile picture via Cloudinary.
*   **URL:** `/profile/upload-avatar`
*   **Method:** `POST`
*   **Headers:** `Content-Type: multipart/form-data`
*   **Body:** `avatar` (File)
*   **Success Response (200):**
    ```json
    { "message": "Profile picture updated succesfully" }
    ```

### 3. Edit Profile
Updates the authenticated user's profile details.
*   **URL:** `/profile/edit-profile`
*   **Method:** `POST`
*   **Body:**
    ```json
    { "name": "New Name", "bio": "New Bio", "gender": "Male/Female/Other" }
    ```
*   **Success Response (201):**
    ```json
    { "message": "Profile update succesfull" }
    ```
