const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const routes = require('./routes/user')
const PORT = process.env.PORT || 5000

const app = express()

//Use middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//route handling
app.use(routes)

//MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected!!!'))
.catch((err) => console.error(`MongoDb connection error :- ${err}`))

//Server listening
app.listen(PORT, () => console.log(`Server listening on PORT - ${PORT}`))