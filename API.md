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
    { 
      "name": "John Doe", 
      "email": "user@example.com", 
      "password": "password123" 
    }
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
      "self": true/false,
      "following": true/false,
      "profile": {
        "username": "...",
        "name": "...",
        "bio": "...",
        "profilePicture": { ... },
        "totalPosts": 0,
        "followers": 0,
        "following": 0
      },
      "message": "profile search succesful"
    }
    ```

### 2. Get User Posts
Retrieves all posts belonging to a specific user.
*   **URL:** `/profile/get-userposts/:id`
*   **Method:** `GET`
*   **Success Response (200):**
    ```json
    {
      "posts": [ { ... } ],
      "message": "User posts fetched successfully"
    }
    ```

### 3. Upload Avatar
Uploads and processes a profile picture via Cloudinary.
*   **URL:** `/profile/upload-avatar`
*   **Method:** `POST`
*   **Headers:** `Content-Type: multipart/form-data`
*   **Body:** `avatar` (File)
*   **Success Response (200):**
    ```json
    { "message": "Profile picture updated succesfully" }
    ```

### 4. Edit Profile
Updates the authenticated user's profile details.
*   **URL:** `/profile/edit-profile`
*   **Method:** `POST`
*   **Body:**
    ```json
    { 
      "name": "New Name", 
      "bio": "New Bio", 
      "gender": "Male/Female/Other",
      "username": "newusername"
    }
    ```
*   **Success Response (200):**
    ```json
    { "message": "Profile update succesful" }
    ```

### 5. Get Followers
Retrieves the list of followers for a specific user.
*   **URL:** `/profile/get-followers/:id`
*   **Method:** `GET`
*   **Success Response (200):**
    ```json
    {
      "followers": [
        { "userId": "...", "username": "...", "profilePicture": "..." }
      ],
      "message": "Followers list retrieved successfully"
    }
    ```

### 6. Get Following
Retrieves the list of users a specific user is following.
*   **URL:** `/profile/get-following/:id`
*   **Method:** `GET`
*   **Success Response (200):**
    ```json
    {
      "following": [
        { "userId": "...", "username": "...", "profilePicture": "..." }
      ],
      "message": "Following list retrieved successfully"
    }
    ```

---

## 🏠 Feed (`/feed`)
*All routes in this section require a valid Bearer Token.*

### 1. Get Feed Posts
Retrieves paginated posts for the main feed with interaction metadata.
*   **URL:** `/feed/get-posts/:page`
*   **Method:** `GET`
*   **Success Response (200):**
    ```json
    {
      "posts": [
        {
          "_id": "...",
          "author": "...",
          "caption": "...",
          "mediaType": "image/video",
          "thumbImage": "...",
          "images": [ { "url": "...", "public_id": "..." } ],
          "video": { "url": "...", "public_id": "..." },
          "authorDetails": { "username": "...", "profilePicture": { ... } },
          "isLiked": true/false,
          "isFollowing": true/false,
          "totalLikes": 0,
          "totalComments": 0
        }
      ],
      "message": "posts retreived succesfully"
    }
    ```

---

## 📝 Posts (`/post`)
*All routes in this section require a valid Bearer Token.*

### 1. Upload Post
Uploads a new post with images or a video.
*   **URL:** `/post/upload-post`
*   **Method:** `POST`
*   **Headers:** `Content-Type: multipart/form-data`
*   **Body:** 
    *   `caption` (String, required)
    *   `images` (File, max 5) OR `video` (File, max 1)
*   **Success Response (200):**
    ```json
    { "message": "Post created succesfully!" }
    ```

### 2. Delete Post
Deletes an existing post and its associated media from Cloudinary.
*   **URL:** `/post/delete-post/:id`
*   **Method:** `DELETE`
*   **Parameters:** `id` (Post ID)
*   **Success Response (200):**
    ```json
    { "message": "Post deleted successfully!" }
    ```

### 3. Update Post
Updates the caption or media of an existing post.
*   **URL:** `/post/update-post`
*   **Method:** `POST`
*   **Headers:** `Content-Type: multipart/form-data`
*   **Body:**
    *   `postId` (String, required)
    *   `caption` (String, optional)
    *   `images` (File, optional, replaces old images) OR `video` (File, optional, replaces old video)
*   **Success Response (200):**
    ```json
    { "message": "Post updated successfully!", "post": { ... } }
    ```

### 4. Toggle Like
Likes or unlikes a post.
*   **URL:** `/post/toggle-like/:postid`
*   **Method:** `POST`
*   **Parameters:** `postid` (Post ID)
*   **Success Response (200):**
    ```json
    { "message": "Post liked/unliked successfully", "isLiked": true/false }
    ```

---

## 💬 Comments (`/comment`)
*All routes in this section require a valid Bearer Token.*

### 1. Create Comment
Adds a new comment or a reply to an existing comment.
*   **URL:** `/comment/create-comment`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "content": "Comment text",
      "postid": "...",
      "parent": "...", (Optional, ID of parent comment for replies)
      "reference": "..." (Optional, ID of comment being replied to)
    }
    ```
*   **Success Response (200):**
    ```json
    { "message": "Comment added successfully", "comment": { ... } }
    ```

### 2. Update Comment
Updates the content of an existing comment.
*   **URL:** `/comment/update-comment`
*   **Method:** `PUT`
*   **Body:**
    ```json
    { "commentId": "...", "content": "Updated text" }
    ```
*   **Success Response (200):**
    ```json
    { "message": "Comment edit succesful" }
    ```

### 3. Delete Comment
Deletes an existing comment and all its nested replies, updating associated counts.
*   **URL:** `/comment/delete-comment/:commentId`
*   **Method:** `DELETE`
*   **Parameters:** `commentId` (Comment ID)
*   **Success Response (200):**
    ```json
    { 
      "message": "Comment and its replies deleted successfully", 
      "deletedCount": 5 
    }
    ```

### 4. Toggle Like
Likes or unlikes a comment.
*   **URL:** `/comment/toggle-like/:commentid`
*   **Method:** `POST`
*   **Parameters:** `commentid` (Comment ID)
*   **Success Response (200):**
    ```json
    { "message": "Comment liked/unliked successfully", "isLiked": true/false }
    ```


---

## 🤝 Follow (`/follow`)
*All routes in this section require a valid Bearer Token.*

### 1. Follow User
Follows another user and updates counts.
*   **URL:** `/follow/follow-user`
*   **Method:** `POST`
*   **Body:**
    ```json
    { "targetId": "..." }
    ```
*   **Success Response (200):**
    ```json
    { "message": "User followed succesfully" }
    ```

### 2. Unfollow User
Unfollows a user and updates counts.
*   **URL:** `/follow/unfollow-user/:targetId`
*   **Method:** `DELETE`
*   **Parameters:** `targetId` (User ID)
*   **Success Response (200):**
    ```json
    { "message": "Unfollowed succesfully" }
    ```
