const mongoose =require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    
    email:{
        type:String,
        required:true,
        unique:true
    },

    name:String,
    bio:{
        type:String,
        default:""
    },

    password:String,
    refreshToken: String,
    otp:String,
    otpExpiry:Number,
    isEmailVerified:{
        type:Boolean,
        default:false
    },

    profilePicture:{
        original: String,
        profileView:String,
        commentView:String
    },
    savedPosts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'post'
        }
    ],
    blockedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],

    totalLikes:{
        type:Number,
        default:0
    },
    totalComments:{
        type:Number,
        default:0
    },
    totalPosts:{
        type:Number,
        default:0
    },
    followers:{
        type:Number,
        default:0
    },
    following:{
        type:Number,
        default:0
    },

    // settings for later use user default settings are stored here
    //settings:{}
    

},{timestamps:true})

module.exports = mongoose.model('user',UserSchema)