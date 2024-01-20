const express = require("express")
const fetchUser = require("../middleware/fetchUser");
const Group = require("../models/Group");
const Expense = require("../models/Expense");
const User = require("../models/User");
const router = express.Router()
const _ = require('underscore');

// Expenses Tasks 
// 1. create expense with title and amount and also set shares(equally uneqaually)
// 2. show all expenses 
// 3. show balances of the users in the group
// 4. settle up with user 2
// 5. balance of all users in group

//ROUTE-1 create a new expense in a group
router.post('/create',fetchUser,
async(req,res)=>{
    try{
        let userId = req.user.id;
        let {description, amount,groupId, participants} = req.body;

        console.log(participants);
        const group = await Group.findById(groupId);

        if(!group){return res.status(404).send("Group not found")}

        //Below function converts the participant array with the email to the array with user id array
        participants = await Promise.all( 
            _.map(participants,(value)=>{
                let participant = User.findOne({ "email": value.user }).select("_id");
                return {
                user: participant._id,
                amountOwed: value.amountOwed,    
                    };
        })
        );
        
        const expense = new Expense({
            description,
            amount,
            group: groupId,
            participants,
        });

        const newExpense = await expense.save();
        res.json(newExpense);
    }catch(error){
        console.log(error.message);
        return res.status(500).send("Some internal error occured");
    }
});

router.get()



module.exports = router