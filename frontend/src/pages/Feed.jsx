import React, { useEffect, useState } from "react";
import api from "../services/api";

// Components
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/Postcard.jsx";
import StoryBar from "../components/Storybar.jsx";
import SuggestedProfiles from "../components/SuggestedProfiles.jsx";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/feed/get-posts/1");
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 lg:pl-20">

      {/* 🔝 NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="mx-auto flex max-w-[1100px] justify-between gap-6 px-4 py-6">

        {/* LEFT / CENTER FEED */}
        <div className="w-full space-y-6 md:mx-auto md:max-w-[614px] lg:mx-0 lg:max-w-[614px]">

          {/* STORIES */}
          <StoryBar />

          {/* POSTS */}
          <div className="mt-10">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-gray-500">No posts yet</p>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </div>

        </div>

        {/* RIGHT SIDEBAR (Desktop only) */}
        <div className="hidden w-80 shrink-0 lg:block lg:self-start">
          <div className="sticky top-24">
            <SuggestedProfiles />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Feed;