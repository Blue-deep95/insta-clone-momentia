const express = require('express')
const app = express()


const PORT = 2000

console.log('server is running')

app.listen(PORT,()=>console.log('server is running on',PORT))