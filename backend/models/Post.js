// post schema
const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        index:true
    },
    caption:{
        type:String,
        required:true
    },
    totalLikes:{
        type:Number,
        default:0
    },
    totalComments:{
        type:Number,
        default:0
    },
    totalShares:{
        type:Number,
        default:0
    },
    
    // images if they exist are stored in array as urls
    images:[
        {type:String}
    ],

    // video if they exist are stored in string url
    video:{
        type:String,
        default:""
    },

    // hashtags for future use 
    hashtags:[
        {
            type:String,
            lowercase:true,
            trim:true
        }
    ],

    // mentions for future uses
    mentions:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ]



},{timestamps:true})


module.exports = mongoose.model('post',PostSchema)