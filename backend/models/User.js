const mongoose =require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:String,
    refreshToken: String,

    profilePicture:{
        original: String,
        profileView:String,
        commentView:String
    },
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