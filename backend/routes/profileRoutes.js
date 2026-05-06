// routes for getting information about user profiles
// in future the page can also be used to adjust settings 
// this page can also be used to upload profile images and updating status only

const express = require('express')
const User = require('../models/User')
const multer = require('multer')

const router = express.Router()
const uploadToCloudinary = require('../utils/uploadToCloudinary')
const deleteFromCloudinary = require('../utils/deleteFromCloudinary')

// prepare multer
const upload = multer({
    storage: multer.memoryStorage()
})


// route that gets information about a profile
// this route can be used to get information about all users not just 
// user own profile if requested profile id matches user's then 
// we send more information
router.get("/get-profile/:id",
    async (req, res) => {
        try {
            const { id } = req.params
            // try to find the user in db
            const target = await User.findById(id).select('-password -email -otp -refreshToken')
            if (!target) {
                return res.status(404).json({ message: "user not found" })
            }
            return res.status(200).json({ profile: target, message: "profile search succesfull" })
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
                await deleteFromCloudinary(old_public_id)
            }


            // the result if succesfull gives out a secure_url that points to that specific image
            const result = await uploadToCloudinary(req.file.buffer, 'momentia/profiles', 'avatar','image')

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
            const { bio, name, gender } = req.body
            const userId = req.user._id
            // first try to find the user 
            const user = await User.findById(userId)
            if (!user) {
                return res.status(400).json({ message: "No such user exists" })
            }

            if (bio !== undefined) user.bio = bio;
            if (name !== undefined) user.name = name;
            if (gender !== undefined) user.gender = gender;

            await user.save()

            return res.status(200).json({ message: 'Profile update succesfull' })
        }

        catch (err) {
            console.log('error in edit-profile route in profile routes 😒', err)
            return res.status(500).json({ message: 'Internal server error' })
        }

    }
)

module.exports = router
