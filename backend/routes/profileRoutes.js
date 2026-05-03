// routes for getting information about user profiles
// in future the page can also be used to adjust settings 
// this page can also be used to upload profile images and updating status only

const express = require('express')
const User = require('../models/User')
const {protect} = require("../middleware/authMiddleware")
router = express.Router()

// route that gets information about a profile
// this route can be used to get information about all users not just 
// user own profile if requested profile id matches user's then 
// we send more information
router.get("/get-profile/:id",
    protect,
    async(req,res)=>{
        try{
            const {id} = req.params
            // try to find the user in db
            const target = await User.findById(id).select('-password -email')
            if(!target){
                return res.status(404).json({message:"user not found"})
            }
            return res.status(200).json({profile:target,message:"profile search succesfull"})
        }
        catch(err){
            console.log('Error in get-profile route',err)
            return res.status(500).json({message:'Internal server error'})
        }
    }
)
