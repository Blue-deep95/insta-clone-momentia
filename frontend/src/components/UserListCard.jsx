import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const UserListCard = ({ 
  user, 
  onActionClick, 
  actionLabel = "Remove", 
  isLoading = false,
  onUserClick
}) => {
  const navigate = useNavigate();

  const avatarSrc =
    user.profilePicture?.commentView ||
    user.profilePicture?.profileView ||
    user.profilePicture ||
    "https://via.placeholder.com/48";

  const handleUserClick = () => {
    if (onUserClick) {
      onUserClick();
    }
    navigate(`/profile/${user.userId}`);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-3 transition hover:bg-gray-50">
      
      {/* Left - User Info */}
      <div
        className="flex flex-1 items-center gap-3 cursor-pointer"
        onClick={handleUserClick}
      >
        <img
          src={avatarSrc}
          alt={user.username}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {user.name || user.username}
          </p>
          <p className="truncate text-xs text-gray-500">
            @{user.username}
          </p>
        </div>
      </div>

      {/* Right - Action Button */}
      <button
        onClick={() => onActionClick(user.userId)}
        disabled={isLoading}
        className={`ml-2 flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
          actionLabel === "Remove"
            ? "bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
        }`}
      >
        {isLoading ? (
          <span className="inline-flex gap-1 items-center">
            <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
          </span>
        ) : (
          actionLabel
        )}
      </button>
    </div>
  );
};

export default UserListCard;
