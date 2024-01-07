//ExpressJS
const express = require("express");
const router = express.Router()
//MiddleWare
const fetchUser = require("../middleware/fetchUser");
//DB Model
const Group = require("../models/Group");
//Validator
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const _ = require('underscore');

/*
Task:
1. Create Group with title with default 
2. update group details like title,currency,description;
3. add members
4. leave group
5. delete group
6. Show all groups

*/

//ROUTE-1 Create a Group with title (AUTH required)
router.post("/creategroup", fetchUser,
[
    body("title","Title cannot be blank").exists(),
]
, async(req,res)=>{
    try{
        //Check whether there are any errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array});
        }
        
        let {title, members} = req.body;
        const userId = req.user.id;


        members = await Promise.all( 
            _.map(members,(value)=>{
            return User.findOne({ "email": value }).select("_id");
        })
        )

        const group = new Group({
            title,
            members:[...members,userId],
            currency: 'INR',
        });
        const newGroup = await group.save();
        res.json(newGroup);
    }catch(error){
        console.log(error.message);
        return res.status(500).send("Some internal error occured");
    }
});

//ROUTE-2 Show all groups (Auth required)
router.get("/allgroups", fetchUser, async (req,res)=>{
    try{
        const userId = req.user.id;

        const groups = await Group.find({members: userId});

        res.json(groups);
    }catch(error){
        console.log(error.message);
        return res.status(500).send("Some internal error occured");
    }
});

// ROUTE-3 update group details like title, description or currency
router.put("/updategroup/:id", fetchUser, async(req,res)=>{
    try{
        const {title,description,currency} = req.body;

        let groupData = {};
        if(title){groupData.title=title}
        if(description){groupData.description= description}
        if(currency){groupData.currency = currency}

        //find the group with given group id
        let group = await Group.findById(req.params.id);
        if(!group){
            return res.status(404).send("Group not found.");
        }
        if(!group.members.includes(req.user.id)){
            return res.status(401).send("Not allowed to update");
        }

        group = await Group.findByIdAndUpdate(req.params.id, {$set : groupData}, {new:true});

        res.json(group);

    }catch(error){
        console.log(error.message());
        return res.status(500).send("Some Internal error Occured");
    }
});



module.exports = router