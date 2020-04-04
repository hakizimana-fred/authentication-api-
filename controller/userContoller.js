const {verify} = require('jsonwebtoken')
const User = require('../model/User')
const signup = async (req, res) => {
    const {email, password} = req.body
    
    try{
        
        const exists = await User.findOne({email})
        if(exists) return res.status(400).json({error: 'User already exists'})

        const user = new User({email})
        user.generateHash(password)

        const saved = await user.save()
        
        return res.status(200).json({user: saved.generateJsonResponse()})
    }catch(err){
        res.status(400).json({errors: `${err}`})
    }
}

 const  signin = async (req, res) => {
    const {email, password} = req.body
    const method = new User()

    try{
        const exists = await User.findOne({email})

        if(exists && exists.comparePasswords(password)) {
           const token =  await User.findOneAndUpdate({_id: exists._id}, {refreshToken: method.generateRefreshToken(exists._id)}, {new: true})
            method.sendRefreshToken(res, token.refreshToken)
            return res.status(200).json({user: exists.generateJsonResponse()})
        }else{
            
            return res.status(400).json({errors: 'Invalid email or password'})
        }
        
    }catch(err){
        res.status(400).json({errors:  `${err.message}`})
    }
}


// Get access token with refresh token
const refreshToken = async(req, res) => {
    const token  = req.cookies.refreshtoken
    if(!token) return res.status(400).json({error: 'Invalid token'})
   let payload = null
   try{
    payload = verify(token ,'lovelylovely')
   }catch(err){
     return err
   }
   const user = await User.findOne({_id: payload.id})
   if (!user) return res.status(200).json({error: "No user match"})

   if(user.refreshToken !== token) return res.status(400).json({errors: 'Mismatch'})

   const method = new User()
   const accesstoken = method.generateToken()
   const refreshedtoken = method.generateRefreshToken(user._id)
    
     try{
        const tokenrefreshed = await  User.findOneAndUpdate({_id: user._id}, {refreshToken: refreshedtoken}, {new: true})
    
        user.sendRefreshToken(res, tokenrefreshed.refreshToken)
        return res.status(200).json({accesstoken})
     }catch(err){
         res.status({json: `${err.message}`})
     }


}

module.exports = {
    signup, 
    signin,
    refreshToken
}