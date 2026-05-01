const express = require('express')
const app = express()
require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")

// import routes
const userRoutes = require('./routes/userRoutes.js')

// import db 
const connectDB = require('./db/db.js')


const PORT = 2000
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// trying to connect db
connectDB(app)

// routes
app.use("/api/user",userRoutes)


app.listen(PORT,()=>console.log('Server is running on',PORT))