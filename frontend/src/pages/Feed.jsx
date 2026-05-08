import React, { useEffect, useState } from "react";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/Postcard.jsx";
import StoryBar from "../components/Storybar.jsx";
import Sidebar from "../components/Sidebar.jsx";

const Feed = () => {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get("/post");
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔝 NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">

        {/* LEFT / CENTER FEED */}
        <div className="space-y-6 lg:col-span-2">

          {/* STORIES */}
          <StoryBar />

          {/* POSTS */}
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : post.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet</p>
          ) : (
            post.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}

        </div>

        {/* RIGHT SIDEBAR (Desktop only) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

      </div>
    </div>
  );
};

export default Feed;