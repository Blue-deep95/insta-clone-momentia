const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')

// this route works as a search for users 
// NOTE: This required a slight modification where we need to include 
// new text indexing to the both usernames and names
router.get("/search-users/:query/:page",
    async (req, res) => {
        try {
            const { query } = req.params
            const page = req.params.page || 1
            const limit = 30  // we send 30 at the same time
            const skip = (parseInt(page)-1) * limit

            if (!query) {
                // instead of sending an error we can send an empty array to notify that 
                // there are no users 
                return res.status(200).json({ results: [], message: "Query is empty" })
            }

            // Using $text search as implemented in User model
            // We also exclude the current user from the search results
            // req.user is available because protect middleware is applied in index.js
            const users = await User.find({
                $text: { $search: query },
                _id: { $ne: req.user._id }
            })
            .select('_id username name profilePicture followers following')
            .sort({score:{$meta:'textScore'}}) // this is a special score i need to learn more about this later
            .skip(skip)
            .limit(limit)
            

            return res.status(200).json({ results: users, message: 'Results acquired successfully' })
        }
        catch (err) {
            console.error("error in search/search-users route", err)
            return res.status(500).json({ message: "Internal server Error" })
        }
    }
)

// same as above but now for posts 
router.get("/search-posts/:query/:page",
    async (req, res) => {
        try {
            const { query } = req.params
            const user = req.user
            const page = req.params.page || 1
            const limit = 30
            const skip  = (parseInt(page)-1)*limit
            
            if (!query) {
                // instead of sending an error we can send an empty array to notify that 
                // there are no users 
                return res.status(200).json({ results: [], message: "Query is empty" })
            }

            // again ignore user's own posts
            const queriedPosts = await Post.find({
                $text:{$search:query},
                author:{$ne:req.user._id}
            })
            .select('_id author thumbImage totalLikes')
            .sort({score:{$meta:'textScore'}})
            .skip(skip)
            .limit(limit)

            return res.status(200).json({results:queriedPosts,message:"Results acquired succesfully"})

        }
        catch (err) {
            console.log("Error in /search/search-posts route", err)
            return res.status(500).json({ message: "Internal server error" })
        }
    }
)

module.exports = router


