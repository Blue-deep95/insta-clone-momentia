const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

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
            console.log("error in /create-comment route 😂", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
);

module.exports = router;
