const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const signin = require('./routes/signin')
const signup = require('./routes/signup')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/register', signup)
app.use('/login', signin)


app.listen(process.env.PORT, (err) => {
    if(err) throw new Error('Someting went wrong')
    console.log('server running', process.env.PORT)
})