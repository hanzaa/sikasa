const userServices = require('../services/user.services')
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const welcomePage = async (req, res) => {
   try {
      res.status(200).send("Welcome Page");
   } catch (error) {
      console.log(error);
   }
};

const register = async (req, res, next) => {
   const { username, password, role } = req.body
   try {
       const hash = await bcrypt.hash(password, 10)
       await userServices.register(username, hash, role)
       res.status(200).send('User have been registered')
   } catch (err) {
         next(err)
   }
}

const login = async (req, res, next) => {
   const { username, password } = req.body;
   try {        
       const user = await userServices.login(username)
       if (user.length == 0) {
           res.status(400).json({
               message: "Incorrect username/password!",
           })
       } else {
           bcrypt.compare(password, user[0].password, (err, result) => {
               if (err) {
                   res.status(500).json({
                       message: "Server error"
                   })
               } else if (result === true) {
                   const token = jwt.sign({
                       userid: user[0].id_user,
                       username: user[0].username,
                       role: user[0].role,
                   }, 
                   process.env.JWT_KEY, 
                   { expiresIn: "1h" })

                   res.status(200).json({
                       username: user[0].username,
                       userrole: user[0].role,
                       token: token
                   })
               } else {
                   if (result != true) {
                       res.status(400).json({
                           message: "Incorrect username/password!"
                       })
                   }
               }
           })
       }
   } catch (err) {
       console.log(err)
       res.status(500).json({
           message: "Database error occurred while signing in!"
       })
   }   
}


module.exports = {
   welcomePage,
   register,
   login
};
