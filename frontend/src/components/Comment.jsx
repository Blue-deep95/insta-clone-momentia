<<<<<<< HEAD
import React, { useState, useCallback, useRef } from "react";
import { X, MessageCircle } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { useGetCommentsQuery, useCreateCommentMutation } from "../slices/commentApi";
=======
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

// Toast Component
const Toast = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-[60] p-4 rounded-2xl shadow-xl text-white transition-all duration-300 border-2 ${
      type === "error" ? "bg-red-500 border-red-400" : "bg-green-500 border-green-400"
    }`}>
      <div className="flex items-center gap-2">
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 text-white hover:text-gray-200 transition">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const CommentItem = ({ comment, postId, onReply }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.totalLikes || 0);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [repliesPage, setRepliesPage] = useState(1);
  const [hasMoreReplies, setHasMoreReplies] = useState(comment.totalReplies > 0);
  const [loadingReplies, setLoadingReplies] = useState(false);

  // Map backend field authorDetails to a consistent internal format if needed
  const author = comment.authorDetails || comment.author;
  const referencedUsername = comment.referencedUser?.username;
  const cleanedContent = (() => {
    if (!comment.content) return "";
    const trimmed = comment.content.trim();
    if (referencedUsername && trimmed.startsWith(`@${referencedUsername}`)) {
      return trimmed.replace(new RegExp(`^@${referencedUsername}\\s*`), "");
    }
    return trimmed;
  })();

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
      // Backend returns { replies: [...] }
      const newReplies = res.data.replies;
      if (newReplies && Array.isArray(newReplies) && newReplies.length > 0) {
        setReplies(prev => [...prev, ...newReplies]);
        setRepliesPage(prev => prev + 1);
        if (newReplies.length < 25) setHasMoreReplies(false);
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
            src={author?.profilePicture?.commentView || author?.profilePicture?.profileView || "https://i.pravatar.cc/150?img=50"}
            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                {author?.username || "user"}
              </h3>
              <span className="text-xs text-zinc-500">
                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
              </span>
            </div>

            <p className="text-sm text-zinc-300 mt-1">
              {referencedUsername && (
                <span className="text-blue-400 mr-1">@{referencedUsername}</span>
              )}
              {cleanedContent}
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
>>>>>>> origin/main

export default function CommentsModal({ post, closeModal }) {
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);
<<<<<<< HEAD
=======
  const [toast, setToast] = useState(null);
>>>>>>> origin/main
  const virtuosoRef = useRef(null);

  const { 
    data: commentsData, 
    isLoading, 
    isFetching 
  } = useGetCommentsQuery({ postId: post?._id, page });

  const [createComment, { isLoading: isPosting }] = useCreateCommentMutation();

  const handleAddComment = async () => {
    if (!input.trim() || isPosting) return;

    try {
      const payload = {
        content: input,
        postid: post._id,
      };

      if (replyTo) {
        payload.parent = replyTo.parent || replyTo._id; 
        payload.reference = (replyTo.authorDetails?._id || replyTo.author?._id || replyTo.author);
      }

      await createComment(payload).unwrap();
      
      setInput("");
      setReplyTo(null);

      if (!replyTo && virtuosoRef.current) {
        virtuosoRef.current.scrollToIndex({ index: 0, align: 'start', behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Error adding comment", err);
<<<<<<< HEAD
=======
      if (err.response?.data?.message) {
        setToast({ message: err.response.data.message, type: "error" });
      } else {
        setToast({ message: "Failed to post comment.", type: "error" });
      }
>>>>>>> origin/main
      alert(err.data?.message || "Failed to post comment.");
    }
  };

  const handleReplyClick = useCallback((comment) => {
    setReplyTo(comment);
    const authorName = comment.authorDetails?.username || comment.author?.username || "user";
    setInput(``);
  }, []);

  const loadMore = useCallback(() => {
    const comments = commentsData?.comments || [];
    const hasMore = comments.length > 0 && (comments.length % 25 === 0);
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [commentsData, isFetching]);

  if (!post) return null;

  const comments = commentsData?.comments || [];

  return (
<<<<<<< HEAD
=======
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* MODAL */}
      <div className="w-full max-w-md h-[80vh] bg-black rounded-t-3xl flex flex-col animate-slideUp">
>>>>>>> origin/main
    <div 
      className="fixed inset-0 bg-black/80 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm overflow-hidden"
      onClick={closeModal}
    >
      <div 
        className="w-full max-w-xl lg:max-w-2xl h-[85vh] sm:h-[70vh] lg:h-[80vh] bg-zinc-950 sm:rounded-2xl flex flex-col animate-slideUp sm:animate-zoomIn shadow-2xl border border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MOBILE HANDLE */}
        <div className="flex justify-center py-3 sm:hidden border-b border-zinc-900">
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white tracking-tight">Comments</h2>
            <div className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400 font-medium">
              {post.totalComments || 0}
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* COMMENTS LIST */}
        <div className="flex-1 min-h-0 w-full overflow-hidden">
          {isLoading && page === 1 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 animate-pulse">
               <div className="w-8 h-8 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
               <p className="text-zinc-500 text-sm font-medium">Fetching conversation...</p>
            </div>
          ) : comments.length > 0 ? (
            <Virtuoso
              ref={virtuosoRef}
              data={comments}
              className="w-full h-full"
              endReached={loadMore}
              increaseViewportBy={400}
              itemContent={(index, comment) => (
                <div className="px-4 sm:px-6 pb-6 pt-2">
                  <CommentItem 
                    comment={comment} 
                    postId={post._id}
                    onReply={handleReplyClick}
                  />
                </div>
              )}
              components={{
                Footer: () => isFetching && (
                  <div className="py-6 flex justify-center">
                    <div className="w-5 h-5 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                )
              }}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 px-10">
              <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center border border-zinc-800/50">
                <MessageCircle size={36} className="text-zinc-700" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xl font-bold text-white">No comments yet</p>
                <p className="text-sm text-zinc-500 max-w-[250px]">Start the conversation by sharing your thoughts on this post.</p>
              </div>
            </div>
          )}
        </div>

        {/* INPUT SECTION */}
        <div className="p-4 sm:p-6 bg-zinc-950 border-t border-zinc-900 sm:rounded-b-2xl">
          <CommentInput 
            input={input}
            setInput={setInput}
            onSend={handleAddComment}
            replyTo={replyTo}
            onClearReply={() => { setReplyTo(null); setInput(""); }}
            isDisabled={isPosting}
          />
        </div>
      </div>
    </div>
  );
}
