const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = (req,res,next) => {
        const jwt_key = process.env.JWT_KEY
        const {token} = req.body

        if(token){
            try {
                const verified = jwt.verify(token,jwt_key)
                return res.status(200).send(verified)
            } catch (error) {
                return res.status(401).send({ message: error.message });                
            }

        }else{
            res.status(403).send({message:'Youre not authenticated, please login first'})
        }
        
}

module.exports = {verifyToken}