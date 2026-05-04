const express = require('express')
const app = express()
require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")

// import routes
const userRoutes = require('./routes/userRoutes.js')
const profileRoutes = require('./routes/profileRoutes.js')

// import db 
const connectDB = require('./db/db.js')


const PORT = 2000

// change this for production 
// app.use(cors(
//     {
//         origin: "http://localhost:5173",
//         credentials: true
//     }
// ))

// to simplyfy testing just use normal cors
app.use(cors())


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// trying to connect db
connectDB(app)

// routes
app.use("/api/user",userRoutes)
app.use("/api/profile",profileRoutes)


app.listen(PORT,()=>console.log('Server is running on',PORT))