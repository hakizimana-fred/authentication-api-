const User = require('../model/User')
async function signup(req, res){
    const {email, password} = req.body
    
    try{
        // Check user exists
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

function signin(req, res){
    console.log('login')
}

module.exports = {
    signup, 
    signin
}