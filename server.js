require('dotenv/config')
const express = require('express')
const cors = require('cors')
const signin = require('./routes/signin')
const signup = require('./routes/signup')
const refreshtoken = require('./routes/refreshtoken')
const mongoose = require('mongoose')
const db = require('./config/db').db
const cookieParser = require('cookie-parser')

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('all well'))
    .catch(err => console.log(err))

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/register', signup)
app.use('/login', signin)
app.use('/refresh_token', refreshtoken)

app.listen(process.env.PORT, (err) => {
    if(err) throw new Error('Someting went wrong')
    console.log('server running', process.env.PORT)
})