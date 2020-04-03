const mongoose = require('mongoose')
const {hashSync, compareSync} = require('bcryptjs')
const {sign} = require('jsonwebtoken')
const {Schema} = mongoose

const userSchema = new Schema({
    email : {type: String, required: true, lowercase: true},
    password: {type: String, required: true},
    refreshToken : {type: String,  default: ''}
})

userSchema.methods.generateHash =  function generateHash(password){
     this.password = hashSync(password, 10)
}
userSchema.methods.comparePasswords = function comparePasswords(password){
    return compareSync(password, this.password)
}

userSchema.methods.generateToken = function generateToken(){
    return sign({
        email: this.email
    }, 'lovey')
}

userSchema.methods.generateJsonResponse = function generateJsonResponse(){
    return {
        email: this.email,
        token : this.generateToken()
    }
}




module.exports = mongoose.model('User', userSchema)