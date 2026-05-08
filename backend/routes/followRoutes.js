
// this is route for following , unfollowing other users
// work in progress

const express = require("express")
const router = express.Router()

const Follow = require('../models/Follow.js')
const User = require('../models/User.js')

router.post("/follow-user",
    async (req, res) => {
        try {
            const user = req.user
            const { targetId } = req.body
            
            // deny following yourself or an invalid target
            if (!targetId || targetId === user._id.toString()) {
                return res.status(400).json({ message: "Invalid target" })
            }

            // Check if target user exists
            const targetUser = await User.findById(targetId)
            if (!targetUser) {
                return res.status(404).json({ message: "User not found" })
            }

            const isFollowing = await Follow.findOne({host:user._id,target:targetId})
            
            if (isFollowing){
                return res.status(403).json({message:"Already following the user"})
            }
            
            // Create follow record
            await Follow.create({
                host:user._id,
                target:targetId
            })

            // Update counts
            await User.findByIdAndUpdate(user._id, { $inc: { following: 1 } })
            await User.findByIdAndUpdate(targetId, { $inc: { followers: 1 } })

            return res.status(200).json({message:"User followed succesfully"})

        }
        catch (err) {
            console.log("error in follow-user route", err)
            return res.status(500).json({ message: "Internal server error" })
        }
    }
)

router.delete("/unfollow-user/:targetId",
    async(req,res) =>{
        try{
            const user = req.user
            const { targetId } = req.params

            if (!targetId || targetId === user._id.toString()) {
                return res.status(400).json({ message: "Invalid target" })
            }

            const followRecord = await Follow.findOneAndDelete({host:user._id,target:targetId})

            if (!followRecord) {
                return res.status(400).json({ message: "You are not following this user" })
            }

            // Update counts
            await User.findByIdAndUpdate(user._id, { $inc: { following: -1 } })
            await User.findByIdAndUpdate(targetId, { $inc: { followers: -1 } })

            return res.status(200).json({message:"Unfollowed succesfully"})
        }
        catch(err){
            console.log("error in unfollow-user route", err)
            return res.status(500).json({ message: "Internal server error" })
        }
    }
)

module.exports = router
