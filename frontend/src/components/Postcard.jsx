import React, { useState } from "react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">

      {/* 🔝 HEADER */}
      <div className="flex items-center justify-between p-4">

        <div className="flex items-center gap-3">
          {/* Profile Image */}
          <img
            src={
              post.user?.profilePic ||
              "https://i.pravatar.cc/150?img=12"
            }
            alt="profile"
            className="h-11 w-11 rounded-full object-cover"
          />

          {/* Username */}
          <div>
            <h3 className="font-semibold text-gray-800">
              {post.user?.username || "momentia_user"}
            </h3>

            <p className="text-xs text-gray-400">
              {post.location || "Momentia"}
            </p>
          </div>
        </div>

        {/* More */}
        <button className="text-xl text-gray-500">
          ⋮
        </button>
      </div>

      {/* 🖼️ POST IMAGE */}
      <div className="w-full bg-gray-100">
        <img
          src={post.image}
          alt="post"
          className="max-h-[600px] w-full object-cover"
        />
      </div>

      {/* ❤️ ACTIONS */}
      <div className="p-4">

        {/* Buttons */}
        <div className="mb-3 flex items-center justify-between">

          <div className="flex items-center gap-5">

            {/* LIKE */}
            <button
              onClick={() => setLiked(!liked)}
              className={`text-2xl transition ${
                liked ? "text-red-500" : "text-gray-700"
              }`}
            >
              {liked ? "❤️" : "🤍"}
            </button>

            {/* COMMENT */}
            <button className="text-2xl text-gray-700">
              💬
            </button>

            {/* SHARE */}
            <button className="text-2xl text-gray-700">
              ✈️
            </button>
          </div>

          {/* SAVE */}
          <button
            onClick={() => setSaved(!saved)}
            className="text-2xl"
          >
            {saved ? "🔖" : "📑"}
          </button>
        </div>

        {/* Likes */}
        <p className="text-sm font-semibold text-gray-800">
          {post.likes?.length || 0} likes
        </p>

        {/* Caption */}
        <div className="mt-2 text-sm">
          <span className="mr-2 font-semibold">
            {post.user?.username || "momentia_user"}
          </span>

          <span className="text-gray-700">
            {post.caption}
          </span>
        </div>

        {/* Comments */}
        <button className="mt-2 text-sm text-gray-500">
          View all comments
        </button>

        {/* Time */}
        <p className="mt-2 text-xs uppercase text-gray-400">
          2 HOURS AGO
        </p>
      </div>
    </div>
  );
};

export default PostCard;