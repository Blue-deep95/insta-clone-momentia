// this route is mainly for creating,deleting updating comments

const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');


// need to implement get-comments route here 
router.get("/get-comments/:postid",
    async(req,res) =>{
        try{

        }
        catch(err){
            console.log("error in get-comments route",err)
            return res.status(500).json({message:"Internal server error"})
        }
    }
)

// This route is mainly for adding comments 
router.post("/create-comment",
    async (req, res) => {
        try {
            const { content, postid, parent, reference } = req.body;
            const user = req.user;
            
            if (!postid || !content) {
                return res.status(400).json({ message: "Invalid comment" });
            }

            // Prepare the base comment data
            const commentData = {
                author: user._id,
                post: postid,
                content: content
            };

            // Add nesting fields if they exist
            if (parent) {
                commentData.parent = parent;
                commentData.reference = reference;
            }

            const comment = new Comment(commentData);
            await comment.save();

            // Update parent's reply count if it's a reply
            if (parent) {
                await Comment.findByIdAndUpdate(parent, { $inc: { totalReplies: 1 } });
            }

            // Update post's comment count
            await Post.findByIdAndUpdate(postid, { $inc: { totalComments: 1 } });

            return res.status(200).json({ message: "Comment added successfully", comment });
        }
        catch (err) {
            console.log("error in /create-comment route ", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
);

router.put("/update-comment",
    async(req,res) =>{
        try{
            const user = req.user
            const {content,commentId} = req.body

            if(!content || !commentId){
                return res.status(400).json({message:"Invalid operation"})
            }
            // get the comment 
            const comment = await Comment.findById(commentId)
            if(!comment){
                return res.status(404).json({message:'Comment not found'})
            }

            if(comment.author.toString() !== user._id.toString()){
                return res.status(403).json({message:'Unauthorized to edit this comment'})
            }

            comment.content = content
            await comment.save()

            return res.status(200).json({message:"Comment edit succesful"})

        }
        catch(err){
            console.log("error in update-comment route",err)
            return res.status(500).json({message:"Internal server error"})
        }
    }
)

router.delete("/delete-comment/:commentId",
    async(req,res) =>{
        try{
            const user = req.user
            const { commentId } = req.params
            
            // Find the comment first to get post and parent info
            const comment = await Comment.findById(commentId)
            
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" })
            }

            // Check if user is the author
            if (comment.author.toString() !== user._id.toString()) {
                return res.status(403).json({ message: "Unauthorized to delete this comment" })
            }

            // 1. Delete all nested replies first
            const deletedReplies = await Comment.deleteMany({ parent: commentId })
            const totalDeletedCount = deletedReplies.deletedCount + 1

            // 2. Delete the main comment
            await Comment.findByIdAndDelete(commentId)

            // 3. Decrement parent's reply count if the deleted comment itself was a reply
            if (comment.parent) {
                await Comment.findByIdAndUpdate(comment.parent, { $inc: { totalReplies: -1 } })
            }

            // 4. Decrement post's comment count by the total number of deleted documents (parent + children)
            await Post.findByIdAndUpdate(comment.post, { $inc: { totalComments: -totalDeletedCount } })

            return res.status(200).json({ 
                message: "Comment and its replies deleted successfully", 
                deletedCount: totalDeletedCount 
            })
            
        }
        catch(err) {
            console.log("Error in delete-comment route", err)
            return res.status(500).json({ message: "Internal server error" })
        }
    }
)

// this route is for toggling likes on comments (like/unlike)
router.post("/toggle-like/:commentid",
    async (req, res) => {
        try {
            const { commentid } = req.params
            const user = req.user

            if (!commentid) {
                return res.status(400).json({ message: "Invalid comment id" })
            }

            // Check if the comment exists
            const comment = await Comment.findById(commentid)
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" })
            }

            // Check if the user already liked the comment
            const existingLike = await Like.findOne({ 
                author: user._id, 
                commentTarget: commentid,
                likeType: 'comment'
            })

            if (existingLike) {
                // If it exists, UNLIKE it
                await Like.findByIdAndDelete(existingLike._id)
                await Comment.findByIdAndUpdate(commentid, { $inc: { totalLikes: -1 } })
                return res.status(200).json({ message: "Comment unliked successfully", isLiked: false })
            } else {
                // If it doesn't exist, LIKE it
                const newLike = new Like({
                    author: user._id,
                    likeType: 'comment',
                    commentTarget: commentid
                })
                await newLike.save()
                await Comment.findByIdAndUpdate(commentid, { $inc: { totalLikes: 1 } })
                return res.status(200).json({ message: "Comment liked successfully", isLiked: true })
            }
        }
        catch (err) {
            console.log("Error in /comment/toggle-like route ", err)
            return res.status(500).json({ message: "Internal server error" })
        }
    }
)

module.exports = router;
