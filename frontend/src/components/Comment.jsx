import React, { useState, useCallback, useRef } from "react";
import { X, MessageCircle } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { useGetCommentsQuery, useCreateCommentMutation } from "../slices/commentApi";

export default function CommentsModal({ post, closeModal }) {
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);
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
