# Instagram-like Followers/Following Functionality

## Overview
This implementation adds Instagram-style followers and following functionality to the Momentia React app. Users can view their followers and following lists with smooth modals, and navigate to other users' profiles.

## Components Created

### 1. **UserListCard.jsx** 
Located: `frontend/src/components/UserListCard.jsx`

Reusable card component for displaying users in lists.

**Props:**
- `user` - User object with: `userId`, `username`, `name`, `profilePicture`
- `actionLabel` - Button label ("Remove", "Unfollow")
- `onActionClick` - Callback when button is clicked
- `isLoading` - Show loading spinner on button

**Features:**
- Click on user card/avatar/name to navigate to their profile
- Action button on the right
- Hover effects
- Responsive design

### 2. **FollowersModal.jsx**
Located: `frontend/src/components/FollowersModal.jsx`

Modal displaying the current user's followers.

**Features:**
- Fetches followers from: `GET /profile/get-followers/:userId`
- Shows list of all followers
- "Remove" button for each follower (UI only - no backend endpoint)
- Click any user to view their profile
- Loading spinner and empty state
- Backdrop blur effect
- Footer showing total count

### 3. **FollowingModal.jsx**
Located: `frontend/src/components/FollowingModal.jsx`

Modal displaying the current user's following list.

**Features:**
- Fetches following from: `GET /profile/get-following/:userId`
- "Unfollow" button calls: `DELETE /follow/unfollow-user/:targetId`
- Updates UI instantly after unfollow
- Click any user to view their profile
- Loading spinner and empty state
- Footer showing total count

## Modified Components

### 1. **Profile.jsx** (`frontend/src/pages/Profile.jsx`)

**Key Changes:**
- Imported `useParams` from React Router
- Added support for viewing other users' profiles via URL parameter `/profile/:userId`
- State: `profileUserId = userId || user?.id` (shows own profile if no param)
- Only shows "Edit Profile" and "Create Post" buttons for own profile
- Shows "Follow" button (placeholder) for other users' profiles
- Integrated `FollowersModal` and `FollowingModal` components

**Usage:**
- Own profile: Navigate to `/profile` or `/profile/{currentUserId}`
- Other user: Navigate to `/profile/{otherUserId}`

### 2. **App.jsx** (`frontend/src/App.jsx`)

**Changes:**
- Added route: `<Route path="/profile/:userId" element={<Profile />} />`
- Supports dynamic profile viewing

## How to Use

### View Your Profile
```
Navigate to /profile
```

### View Followers/Following Lists
1. Click on the **Followers** count on your profile
2. Click on the **Following** count on your profile
3. Modal opens with user list

### Interact with Lists

**In Followers Modal:**
- Click on any user card/name/avatar → View their profile
- Click "Remove" button → Remove from followers (UI only)

**In Following Modal:**
- Click on any user card/name/avatar → View their profile
- Click "Unfollow" button → Unfollow user (calls backend API)
- Following count updates instantly

### View Other User's Profile
1. Click on a user card in followers/following list
2. Or navigate directly to `/profile/{userId}`
3. View their profile, followers, and following lists
4. Follow button available (placeholder - not implemented yet)

## API Endpoints Used

### Get Followers
```
GET /profile/get-followers/:userId
```
Returns: Array of followers with userId, username, profilePicture

### Get Following
```
GET /profile/get-following/:userId
```
Returns: Array of following with userId, username, profilePicture

### Unfollow User
```
DELETE /follow/unfollow-user/:targetId
```
Requires: Authorization header with token
Updates: Profile's following count

## Design Features

### UI/UX
- Modern Instagram-style cards
- Smooth hover effects
- Responsive mobile and desktop layout
- Backdrop blur on modals
- Tailwind CSS styling
- Loading spinners during data fetching
- Empty states with helpful messages

### Accessibility
- Proper semantic HTML
- ARIA labels on buttons
- Keyboard navigable
- Click areas are large enough (44px minimum)

### Performance
- Lazy loading of modals
- Efficient state management
- Prevents unnecessary re-renders

## Frontend Stack Used

- **React** - Component library
- **React Router** - Navigation and URL parameters
- **Redux** - State management (for auth user)
- **Axios** - API client (via `api` service)
- **Tailwind CSS** - Styling
- **Lucide React** - Icons (User, X for close)

## Notes

### Limitations
1. **Remove Follower**: Current backend doesn't have an endpoint to remove followers. This action is UI-only and removes the user from the list on the frontend only.
2. **Follow Button**: On other users' profiles, the Follow button is a placeholder. To fully implement, you'd need to add follow functionality.

### Future Enhancements
1. Implement follow/unfollow button for other users' profiles
2. Add search/filter in followers/following lists
3. Add mutual followers indicator
4. Add "Remove follower" backend endpoint
5. Add action to block users from followers list
6. Add follower request notifications

## Testing

### To Test the Functionality:

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Login** to your account
4. **Navigate to Profile** page
5. **Click on Followers/Following** counts
6. **Try clicking user cards** to navigate to their profiles
7. **Try unfollowing** users from the Following modal
8. **Navigate directly** to other user profiles using `/profile/{userId}` route

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── UserListCard.jsx (NEW)
│   │   ├── FollowersModal.jsx (NEW)
│   │   ├── FollowingModal.jsx (NEW)
│   │   └── ...other components
│   ├── pages/
│   │   ├── Profile.jsx (MODIFIED)
│   │   └── ...other pages
│   ├── App.jsx (MODIFIED)
│   └── ...other files
```

## Backend Requirements Met

✅ No backend code modified
✅ Using only existing API routes
✅ `/profile/get-followers/:id`
✅ `/profile/get-following/:id`
✅ `/follow/unfollow-user/:targetId`

