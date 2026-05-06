const jwt=require("jsonwebtoken")
const User=require("../models/User.js")

const protect=async(req,res,next)=>{
    let token
    if (req.headers.Authorization && req.headers.Authorization.startsWith("Bearer")) {
        try{
            token=req.headers.Authorization.split(" ")[1]
            const decoded=jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
            const user= await User.findById(decoded.id)
               .select("-password -refreshToken")
            if (!user){
                return res.status(400).json({message:"invalid token"})
            }
            
            req.user = user
            
            next()
        }
        catch(err){
            return res.status(401).json({ messasge:"Invalid access token" })
        }
    }
}


module.exports={protect}