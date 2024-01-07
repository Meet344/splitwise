const mongoose = require("mongoose")
const {Schema} = mongoose

const ExpenseSchema = new Schema({
    description:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true
    },
    paidBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    },
    participants:{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        amountOwed:{
            type: Number,
        }
    },
    date:{
        type: Date,
        default: Date.now,
    },
    


})