
// theese routes are mainly for uploading,updating and deleting posts
const express = require('express')
const multer = require('multer')

const router = express.Router()
const User = require('../models/User')
const uploadToCloudinaryImages = require('../utils/uploadToCloudinary')

let upload = multer({
    storage: multer.memoryStorage()
})

// for now this route only supports image uploads in future maybe 
// videos can be added. 
router.post("/upload-post",
    upload.array("images", 5),
    async (req, res) => {
        console.log('request reached upload post')
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No media uploaded" })
            }

            // there is no need to find the user becuase req.user contains it 
            const user = req.user
            // loop through the files and catch all images send them to cloudinary
            // work in progress
            return 



        }
        catch (err) {
            console.log('error in upload post route 😂', err)
            return res.status(500).json({ message: "internal server error" })
        }

    }
)










module.exports = router

