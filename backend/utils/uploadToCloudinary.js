
// special function that handles converting the images into proper stream
const { Readable } = require('stream')
const cloudinary = require('./cloudinary')


const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        // creating a cloudinary upload stream
        const cldUploadStream = cloudinary.uploader.upload_stream(
            { folder: folder,
                format:'webp',
                transformation:[
                    // limit upload sizess to just 1000 x 1000
                { width: 1000, height: 1000, crop: "limit" }
                ]
             },
            (error, result) => {
                if (result) resolve(result)
                else reject(error)

            }
        )
        Readable.from(buffer).pipe(cldUploadStream)
    })

}

module.exports = uploadToCloudinary