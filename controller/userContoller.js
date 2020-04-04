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
        const exists = await User.findOneAndUpdate({email}, {refreshToken: method.generateRefreshToken()}, {new: true})

        if(exists && exists.comparePasswords(password)) {
            method.sendRefreshToken(res, exists.refreshToken)
            return res.status(200).json({user: exists.generateJsonResponse()})
        }else{
            
            return res.status(400).json({errors: 'Invalid email or password'})
        }
        
    }catch(err){
        res.status(400).json({errors:  `${err.message}`})
    }
}

module.exports = {
    signup, 
    signin
}