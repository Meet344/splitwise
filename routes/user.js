//Express js libraries
const express = require("express");
const router = express.Router();

//validation
const {body, validationResult} = require("express-validator");

//Hashing
const bcrypt = require("bcryptjs");

//Models
const User = require("../models/User");

//Auth libraries
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'thisisthesecret';

//Middleware
const fetchUser = require('../middleware/fetchUser')

//Route 1: Get all the users using Get request
router.post("/login",
    [
        body("email", "Enter a valid email").isEmail(),
        body("password", "Password cannot be blank").exists()
    ],
    async(req,res)=>{
        console.log(req.body);
        let success = false;
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success, errors: errors.array() });
        }

        try{
            const {email, password} = req.body;

            //check whether user exists
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({success, errors: "Please login with correct credentials"});
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                return res.status(400).json({success, errors: "Please login with correct credentials"});
            }

            const data = {
                user :{
                    id: user.id
                }
            };
            var authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({success, authtoken})

        }catch(error){
            console.log(success, error.message);
            return res.status(500).send("Some internal error occured");
        }

    }
);

// ROUTE2: SIGNUP User
router.post("/signup", 
    [
        body("name", "Name must be of 3 letters").isLength({ min: 3 }),
        body("email", "Enter a valid email").isEmail(),
        body("phone", "Phone number must be of 10 digits").isLength({min:3}),
        body("password", "password must be min 3 letters").isLength({ min: 3 }),
    ],
    async (req,res)=>{
        console.log(req.body);

        let success = false;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success, errors: errors.array});
        }

        try{
            let user = await User.findOne({email: req.body.email});
            if(user){
                return res.status(400).json({success, errors: "Sorry a user with this email already exists"});
            }

            var salt = bcrypt.genSaltSync(10)
            const secPass = await bcrypt.hash(req.body.password, salt)

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: secPass,
            });

            const data = {
                user :{
                    id: user.id
                }
            };
            var authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({success, authtoken});


            
        }catch(error){
            console.log(success, error.message);
            return res.status(500).send("Some internal error occured");
        }
    }
)


// ROUTE 3 Update User details (AUTH required)
router.put("/updateUser",fetchUser, async (req,res)=>{
    try{
        const {name, email, phone, password} = req.body;
        if(password){
            const salt = bcrypt.genSaltSync(10);
            const secPass = bcrypt.hash(password, salt);
        }
        const userData = {}
        if(name){userData.name = name}
        if(email){userData.email = email}
        if(phone){userData.phone = phone}
        if(password){userData.password = secPass}

        //Find the user to be updated
        const userId = req.user.id;
        let user = await User.findById(userId)
        if(!user){return res.status(404).send("User not Found!")}

        //update the user
        let updatedUser = await User.findByIdAndUpdate(userId, {$set: userData}, {new:true})
        res.json(updatedUser)
    }
    catch(error){
        console.log(error.message);
        return res.status(500).send("Some internal error occured")
    }
}
);

//ROUTE-4 Get User Details
router.get("/getuser", fetchUser, async(req,res)=>{
    try{
        const userId= req.user.id;
        let user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).send("User not found!")
        }
        res.send(user)
    }catch(error){
        console.log(error.message);
        return res.status(500).send("Some Internal error Occured");
    }
})


module.exports = router;