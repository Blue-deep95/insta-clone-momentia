
// special function that handles converting the images into proper stream

const cloudinary = require('./cloudinary')


const uploadToCloudinaryImages = (buffer, folder, type = 'post') => {
    let transformation = []
    if (type === 'post') {
        transformation =[
            {width:1200,crop:'limit'},
            {quality:'auto'}
        ]
    }
    else if (type === 'avatar') {
        transformation = [
            // limit upload sizess to just 1000 x 1000
            { width: 1000, height: 1000, crop: "fill",gravity:"face" },
            {quality:"auto"},
        ]
    }
    return new Promise((resolve, reject) => {
        // creating a cloudinary upload stream
        const cldUploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                format: 'webp',
                transformation
             },
            (error, result) => {
                if (result) resolve(result)
                else reject(error)

            }
        )
        cldUploadStream.end(buffer)
    })

}

module.exports = uploadToCloudinaryImages