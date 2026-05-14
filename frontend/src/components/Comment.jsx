// CommentsModal.jsx

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";
import {
  Heart,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const CommentItem = ({ comment, postId, onReply }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.totalLikes || 0);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [repliesPage, setRepliesPage] = useState(1);
  const [hasMoreReplies, setHasMoreReplies] = useState(comment.totalReplies > 0);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const toggleLike = async () => {
    try {
      const res = await api.post(`/comment/toggle-like/${comment._id}`);
      setIsLiked(res.data.isLiked);
      setLikesCount(prev => res.data.isLiked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error("Error liking comment", err);
    }
  };

  const fetchReplies = async () => {
    if (loadingReplies) return;
    setLoadingReplies(true);
    try {
      const res = await api.get(`/comment/get-replies/${postId}/${comment._id}/${repliesPage}`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setReplies(prev => [...prev, ...res.data]);
        setRepliesPage(prev => prev + 1);
        if (res.data.length < 10) setHasMoreReplies(false);
      } else {
        setHasMoreReplies(false);
      }
    } catch (err) {
      console.error("Error fetching replies", err);
      setHasMoreReplies(false);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleToggleReplies = () => {
    if (!showReplies && replies.length === 0) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-3">
        {/* LEFT */}
        <div className="flex gap-3 flex-1">
          <img
            src={comment.author?.profilePicture?.commentView || "https://i.pravatar.cc/150?img=50"}
            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                {comment.author?.username || "user"}
              </h3>
              <span className="text-xs text-zinc-500">
                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
              </span>
            </div>

            <p className="text-sm text-zinc-300 mt-1">
              {comment.reference && (comment.reference.username || comment.reference) && (
                <span className="text-blue-400 mr-1">@{comment.reference.username || comment.reference}</span>
              )}
              {comment.content}
            </p>

            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 font-semibold">
              <button onClick={() => onReply(comment)} className="hover:text-zinc-300">
                Reply
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center">
          <button onClick={toggleLike}>
            <Heart
              size={14}
              className={`${isLiked ? "fill-red-500 text-red-500" : "text-zinc-500"}`}
            />
          </button>
          <span className="text-[10px] text-zinc-500 mt-0.5">
            {likesCount}
          </span>
        </div>
      </div>

      {/* REPLIES SECTION */}
      {(comment.totalReplies > 0 || replies.length > 0) && (
        <div className="ml-12">
          <button 
            onClick={handleToggleReplies}
            className="flex items-center gap-2 text-xs text-zinc-500 font-semibold hover:text-zinc-300 transition"
          >
            <div className="w-6 h-[1px] bg-zinc-700" />
            {showReplies ? (
              <>Hide replies <ChevronUp size={14} /></>
            ) : (
              <>View replies ({comment.totalReplies || replies.length}) <ChevronDown size={14} /></>
            )}
          </button>

          {showReplies && (
            <div className="mt-4 space-y-4 border-l border-zinc-800 pl-4">
              {replies.map(reply => (
                <CommentItem 
                  key={reply._id || Math.random()} 
                  comment={reply} 
                  postId={postId} 
                  onReply={onReply}
                />
              ))}
              {hasMoreReplies && (
                <button 
                  onClick={fetchReplies}
                  className="text-xs text-zinc-500 font-semibold mt-2"
                >
                  {loadingReplies ? "Loading..." : "Load more replies"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function CommentsModal({ post, closeModal }) {
  const { user } = useSelector(state => state.auth);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  // FETCH COMMENTS
  const fetchComments = async (reset = false) => {
    if (loading && !reset) return;
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const res = await api.get(`/comment/get-comments/${post._id}/${currentPage}`);
      
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setComments(prev => reset ? res.data : [...prev, ...res.data]);
        setPage(currentPage + 1);
        if (res.data.length < 10) setHasMore(false);
      } else {
        if (reset) setComments([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching comments", err);
      // Even if fetch fails (e.g. timeout), stop the loading state
      if (reset) setComments([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post?._id) {
      fetchComments(true);
    }
  }, [post?._id]);

  // ADD COMMENT
  const handleAddComment = async () => {
    if (!input.trim()) return;

    try {
      const payload = {
        content: input,
        postid: post._id,
      };

      if (replyTo) {
        payload.parent = replyTo.parent || replyTo._id; 
        payload.reference = replyTo.author._id;
      }

      const res = await api.post("/comment/create-comment", payload);
      const newComment = res.data.comment;

      // Add local author details for immediate display
      newComment.author = user;

      if (!replyTo) {
        setComments(prev => [newComment, ...prev]);
      } else {
        // Find the parent and add to its local replies if possible, 
        // or just re-fetch that comment's replies if we had a more complex state.
        // For simplicity, we'll alert or just add to the parent's local replies if we change state structure.
        setComments(prev => prev.map(c => {
            if (c._id === (replyTo.parent || replyTo._id)) {
                return {
                    ...c,
                    totalReplies: (c.totalReplies || 0) + 1,
                    replies: [...(c.replies || []), newComment]
                };
            }
            return c;
        }));
      }

      setInput("");
      setReplyTo(null);
    } catch (err) {
      console.error("Error adding comment", err);
      alert("Failed to post comment. Check if the server is responding.");
    }
  };

  const handleReplyClick = (comment) => {
    setReplyTo(comment);
    setInput(`@${comment.author.username} `);
  };

  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      {/* MODAL */}
      <div className="w-full max-w-md h-[80vh] bg-black rounded-t-3xl flex flex-col animate-slideUp">
        
        {/* TOP HANDLE */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-zinc-600 rounded-full" />
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Comments</h2>
          <button onClick={closeModal}>
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* COMMENTS LIST */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {comments.map((comment) => (
            <CommentItem 
              key={comment._id || Math.random()} 
              comment={comment} 
              postId={post._id}
              onReply={handleReplyClick}
            />
          ))}
          
          {loading && <p className="text-center text-zinc-500 text-xs py-4">Loading...</p>}
          
          {hasMore && !loading && comments.length > 0 && (
            <button 
              onClick={() => fetchComments()}
              className="w-full text-zinc-500 text-xs py-4 hover:text-zinc-300"
            >
              Load more
            </button>
          )}

          {!loading && comments.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 mt-20">
              <p className="text-lg font-bold text-white">No comments yet</p>
              <p className="text-sm">Start the conversation.</p>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="border-t border-zinc-800 px-4 py-3 bg-black">
          {replyTo && (
            <div className="flex justify-between items-center mb-2 px-2 py-1 bg-zinc-900 rounded text-xs text-zinc-400">
              <span>Replying to @{replyTo.author.username}</span>
              <button onClick={() => { setReplyTo(null); setInput(""); }}>
                <X size={14} />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {/* USER */}
            <img
              src={user?.profilePicture?.commentView || "https://i.pravatar.cc/150?img=60"}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
            />

            {/* INPUT BOX */}
            <div className="flex-1 bg-zinc-900 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                className="w-full bg-transparent outline-none text-white text-sm"
              />
            </div>

            {/* SEND */}
            <button
              onClick={handleAddComment}
              disabled={!input.trim()}
              className={`font-semibold ${input.trim() ? "text-blue-500" : "text-blue-900 cursor-not-allowed"}`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
