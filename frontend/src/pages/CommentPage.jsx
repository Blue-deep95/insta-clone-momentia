// CommentsPage.jsx

import React, { useEffect, useState, useCallback } from "react";

import { Virtuoso } from "react-virtuoso";

import {
  Heart,
  Send,
  MoreHorizontal,
  Smile,
  ChevronLeft,
} from "lucide-react";

import axios from "axios";



// =====================================================
// AXIOS INSTANCE
// =====================================================

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});



// =====================================================
// COMPONENT
// =====================================================

export default function CommentsPage({ postId }) {

  const [comments, setComments] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 10;



  // =====================================================
  // FETCH COMMENTS WITH PAGINATION
  // =====================================================

  const fetchComments = useCallback(async () => {

    if (loading || !hasMore) return;

    try {

      setLoading(true);

      const response = await API.get(
        `/comment/get-comments/${postId}?page=${page}&limit=${LIMIT}`
      );

      const newComments = response.data.comments || [];



      // Append Comments
      setComments((prev) => [...prev, ...newComments]);



      // Check Has More
      if (newComments.length < LIMIT) {
        setHasMore(false);
      }



      setPage((prev) => prev + 1);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }

  }, [page, postId, loading, hasMore]);



  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchComments();
  }, []);



  // =====================================================
  // ADD COMMENT
  // =====================================================

  const handleAddComment = async () => {

    if (!input.trim()) return;

    try {

      const response = await API.post(
        "/comment/create-comment",
        {
          content: input,
          postid: postId,
        }
      );



      // Add New Comment On Top
      setComments((prev) => [
        response.data.comment,
        ...prev,
      ]);



      setInput("");

    } catch (error) {

      console.log(error);
    }
  };



  // =====================================================
  // TOGGLE LIKE
  // =====================================================

  const handleLike = async (commentId) => {

    try {

      await API.post(
        `/comment/toggle-like/${commentId}`
      );



      // Update UI
      setComments((prev) =>
        prev.map((comment) => {

          if (comment._id === commentId) {

            return {
              ...comment,
              isLiked: !comment.isLiked,
              likesCount: comment.isLiked
                ? comment.likesCount - 1
                : comment.likesCount + 1,
            };
          }

          return comment;
        })
      );

    } catch (error) {

      console.log(error);
    }
  };



  // =====================================================
  // COMMENT CARD
  // =====================================================

  const CommentCard = ({ comment }) => {

    return (
      <div className="flex justify-between gap-3 px-4 py-5 border-b border-zinc-900">

        {/* LEFT SIDE */}
        <div className="flex gap-3 flex-1">

          {/* PROFILE */}
          <img
            src={
              comment.user?.profilePic ||
              "https://i.pravatar.cc/150?img=12"
            }
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />



          {/* CONTENT */}
          <div className="flex-1">

            {/* USERNAME */}
            <div className="flex items-center gap-2">

              <h3 className="font-semibold text-sm">
                {comment.user?.username || "momentia_user"}
              </h3>

              <span className="text-zinc-500 text-xs">
                {comment.createdAt
                  ? new Date(comment.createdAt)
                      .toLocaleDateString()
                  : "now"}
              </span>

            </div>



            {/* COMMENT */}
            <p className="text-sm mt-1 leading-5">
              {comment.content}
            </p>



            {/* ACTIONS */}
            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">

              <button>
                Reply
              </button>

              <button>
                See translation
              </button>

            </div>



            {/* REPLIES */}
            {comment.replies?.length > 0 && (

              <div className="mt-4 ml-4 border-l border-zinc-800 pl-4 space-y-4">

                {comment.replies.map((reply) => (

                  <div
                    key={reply._id}
                    className="flex justify-between gap-3"
                  >

                    <div className="flex gap-3 flex-1">

                      <img
                        src={
                          reply.user?.profilePic ||
                          "https://i.pravatar.cc/150?img=20"
                        }
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />



                      <div>

                        <div className="flex items-center gap-2">

                          <h4 className="text-sm font-semibold">
                            {reply.user?.username}
                          </h4>

                          <span className="text-xs text-zinc-500">
                            {reply.createdAt
                              ? new Date(reply.createdAt)
                                  .toLocaleDateString()
                              : "now"}
                          </span>

                        </div>



                        <p className="text-sm mt-1">
                          {reply.content}
                        </p>

                      </div>
                    </div>



                    {/* REPLY LIKE */}
                    <button
                      onClick={() => handleLike(reply._id)}
                    >
                      <Heart
                        size={16}
                        className={
                          reply.isLiked
                            ? "fill-red-500 text-red-500"
                            : ""
                        }
                      />
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>



        {/* RIGHT SIDE */}
        <div className="flex flex-col items-center">

          <button
            onClick={() => handleLike(comment._id)}
          >
            <Heart
              size={18}
              className={
                comment.isLiked
                  ? "fill-red-500 text-red-500"
                  : ""
              }
            />
          </button>



          <span className="text-xs text-zinc-400 mt-1">
            {comment.likesCount || 0}
          </span>

        </div>
      </div>
    );
  };



  return (
    <div className="bg-black min-h-screen text-white flex justify-center">

      {/* MOBILE CONTAINER */}
      <div className="w-full max-w-sm bg-black border-x border-zinc-900 flex flex-col h-screen">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-900">

          <div className="flex items-center gap-3">

            <ChevronLeft size={24} />

            <h1 className="text-lg font-semibold">
              Comments
            </h1>

          </div>

          <MoreHorizontal size={24} />

        </div>



        {/* REEL PREVIEW */}
        <div className="p-4">

          <div className="rounded-3xl overflow-hidden bg-zinc-900">

            <img
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a"
              alt=""
              className="w-full h-72 object-cover"
            />

          </div>

        </div>



        {/* COMMENTS LIST */}
        <div className="flex-1">

          <Virtuoso

            data={comments}

            endReached={() => {
              if (hasMore) {
                fetchComments();
              }
            }}

            itemContent={(index, comment) => (
              <CommentCard comment={comment} />
            )}

            components={{
              Footer: () => (

                <div className="py-6 text-center text-sm text-zinc-500">

                  {loading
                    ? "Loading comments..."
                    : hasMore
                    ? ""
                    : "No more comments"}

                </div>
              ),
            }}

          />
        </div>



        {/* EMOJIS */}
        <div className="border-t border-zinc-900 px-4 py-2 flex justify-between text-2xl">
          <span>😂</span>
          <span>🙌</span>
          <span>💯</span>
          <span>😭</span>
          <span>🥺</span>
          <span>😍</span>
          <span>😅</span>
          <span>😂</span>
        </div>



        {/* INPUT */}
        <div className="border-t border-zinc-900 px-4 py-3 flex items-center gap-3 bg-black">

          {/* USER IMAGE */}
          <img
            src="https://i.pravatar.cc/150?img=45"
            alt=""
            className="w-9 h-9 rounded-full"
          />



          {/* INPUT BOX */}
          <div className="flex-1 bg-zinc-900 rounded-full px-4 py-2 flex items-center">

            <input
              type="text"
              placeholder="What do you think of this?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm"
            />

            <Smile
              size={18}
              className="text-zinc-400"
            />

          </div>



          {/* SEND */}
          <button onClick={handleAddComment}>
            <Send size={22} />
          </button>

        </div>
      </div>
    </div>
  );
}