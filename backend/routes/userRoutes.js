const express=require("express")
const router=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const User=require("../models/User.js")



router.post("/register",async(req,res)=>{
    try{
        const {name,email,password}=req.body
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"user already exists"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const user=await User.create({
            name,
            email,
            password:hashedPassword
        })
        res.status(201).json({message:"user created successfully"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"server error"})
    }
})


router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"invalid email or user not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"invalid password"})
        }
       const accessToken=generateAccessToken(user)
       const refreshToken=generateRefreshToken(user)
       user.refreshToken=refreshToken
       await user.save()
       res.cookie("refreshToken",refreshToken, {
        httpOnly:true,
        sameSite:"lax",
        secure:false,
        path:"/",
        maxAge:7 * 24 * 60 * 60 * 1000
       })
       res.status(200).json({accessToken:accessToken,
        user:{
            id: user._id,
            name: user.name,
            email: user.email
        },
        message:"Login successful"
       })
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"error from user login"})
    }
})

router.post("/regenerate-access-token",async(req,res)=>{
    const refreshToken=req.cookies.refreshToken
    try{
        const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH_TOKEN)
        const user= await User.findById(decoded.id)
        if (!user){
            return res.status(400).json({message:"user not found"})
        }
        const newAccessToken= generateAccessToken(user)
        return res.status(200).json({accessToken:newAccessToken})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"error from regenerate access token"})
    }
})

router.post("/logout",async(req,res)=>{
    const refreshToken = req.cookies.refreshToken
    const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH_TOKEN)
    const user=await User.findById(decoded.id)
    user.refreshToken= null
    await user.save()
    res.clearCookie("refreshToken")
    res.status(200).json({message:"Logout successful"})
})


module.exports=router