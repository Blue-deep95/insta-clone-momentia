// routes for getting information about user profiles
// in future the page can also be used to adjust settings 
// this page can also be used to upload profile images and updating status only

const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User')
const Follow = require('../models/Follow.js')
const Post = require('../models/Post')
const multer = require('multer')

const router = express.Router()
const uploadToCloudinary = require('../utils/uploadToCloudinary')
const deleteFromCloudinary = require('../utils/deleteFromCloudinary')

// prepare multer
const upload = multer({
    storage: multer.memoryStorage()
})


// **need to write another route here that only sends the user's posts only
// for profile view
router.get("/get-userposts/:id",
    async (req, res) => {
        try {
            const userId = req.user._id
            const posts = await Post.find({ author: userId }).sort({ createdAt: -1 })
            return res.status(200).json({ posts, message: "User posts fetched successfully" })
        }
        catch (err) {
            console.log('Error in get-userposts route', err)
            return res.status(500).json({ message: "Internal server error" })
        }
    }
)


// route that gets information about a profile
// this route can be used to get information about all users not just 
// user own profile if requested profile id matches user's then 
// we send more information
router.get("/get-profile/:id",
    async (req, res) => {
        try {
            const { id } = req.params
            // try to find the user in db
            const target = await User.findById(id).select('-password -email -otp -refreshToken ')
            if (!target) {
                return res.status(404).json({ message: "User not found" })
            }
            // case where the request is from the user 
            if (target._id.toString() === req.user._id.toString()) {
                return res.status(200).json({ self: true, following: false, profile: target, message: "Your profile fetched succesfully" })
            }
            // for fetching other's profile we must also check whether the user is following the target or not
            const isUserFollowingTarget = await Follow.findOne({ host: req.user._id, target: target._id })

            let following = false
            if (isUserFollowingTarget) {
                following = true
            }

            return res.status(200).json({ self: false, following, profile: target, message: "profile search succesful" })
        }
        catch (err) {
            console.log('Error in get-profile route', err)
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
)

// route for uploading profile pics(avatars)
router.post("/upload-avatar",
    upload.single('avatar'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No image provided" })
            }
            // upload to cloudinary using utility function
            const userId = req.user._id

            // additional steps If the user already has an image uploaded remove it from cloudinary
            // then upload to the file 

            const user = await User.findById(userId)
            if (!user) {
                return res.status(400).json({ message: "invalid user" })
            }
            const old_public_id = user.profilePicture?.original?.public_id

            if (old_public_id) {
                await deleteFromCloudinary(old_public_id, 'image')
            }


            // the result if succesfull gives out a secure_url that points to that specific image
            const result = await uploadToCloudinary(req.file.buffer, 'momentia/profiles', 'avatar', 'image')

            // create seperate profile and comment views
            const profileViewUrl = result.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill,g_face,q_auto/')
            const commentViewUrl = result.secure_url.replace('/upload/', '/upload/w_50,h_50,c_fill,g_face,q_auto/')

            // try to update the user profile pictures in mongodb
            const response = await User.findByIdAndUpdate(userId,
                {
                    profilePicture: {
                        original: {
                            url: result.secure_url,
                            public_id: result.public_id
                        },
                        profileView: profileViewUrl,
                        commentView: commentViewUrl
                    }
                }
            )
            return res.status(200).json({ message: 'Profile picture updated succesfully' })
        }
        catch (err) {
            console.log("error in upload-avatar route 😒", err)
            return res.status(500).json({ message: "Internal server error" })
        }
    }
)

// this route is only for changing bio and name and gender
router.post("/edit-profile",
    async (req, res) => {
        try {
            const { bio, name, gender, username } = req.body
            const userId = req.user._id
            // first try to find the user 
            const user = await User.findById(userId)
            if (!user) {
                return res.status(400).json({ message: "No such user exists" })
            }

            // Check for username uniqueness ONLY if it is being changed
            if (username && username !== user.username) {
                const isUserNameTaken = await User.findOne({ username: username })
                if (isUserNameTaken) {
                    return res.status(400).json({ message: "Username already taken please choose another one" })
                }
                user.username = username
            }

            if (bio !== undefined) user.bio = bio;
            if (name !== undefined) user.name = name;
            if (gender !== undefined) user.gender = gender;

            await user.save()

            return res.status(200).json({ message: 'Profile update succesful' })
        }

        catch (err) {
            console.log('error in edit-profile route in profile routes 😒', err)
            return res.status(500).json({ message: 'Internal server error' })
        }

    }
)

// route for getting followers list of a specific user
router.get("/get-followers/:id",
    async (req, res) => {
        try {
            const { id } = req.params // This is the ID of the user whose followers we want to see

            const followers = await Follow.aggregate([
                { $match: { target: new mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'host',
                        foreignField: '_id',
                        as: 'followerData'
                    }
                },
                { $unwind: '$followerData' },
                {
                    $project: {
                        _id: 0,
                        userId: '$followerData._id',
                        username: '$followerData.username',
                        profilePicture: '$followerData.profilePicture.commentView'
                    }
                }
            ]);

            return res.status(200).json({
                followers: followers,
                message: "Followers list retrieved successfully"
            })
        }

        catch (err) {
            console.log('error in get-followers list', err)
            return res.status(500).json({ message: "Internal server Error" })
        }
    }
)

// route for getting following list of a specific user
router.get("/get-following/:id",
    async (req, res) => {
        try {
            const { id } = req.params // This is the ID of the user whose following list we want to see

            const following = await Follow.aggregate([
                { $match: { host: new mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'target',
                        foreignField: '_id',
                        as: 'followingData'
                    }
                },
                { $unwind: '$followingData' },
                {
                    $project: {
                        _id: 0,
                        userId: '$followingData._id',
                        username: '$followingData.username',
                        profilePicture: '$followingData.profilePicture.commentView'
                    }
                }
            ]);

            return res.status(200).json({
                following: following,
                message: "Following list retrieved successfully"
            })
        }
        catch (err) {
            console.log('error in get-following list', err)
            return res.status(500).json({ message: "Internal server Error" })
        }
    }
)


module.exports = router
