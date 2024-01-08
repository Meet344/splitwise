const mongoose = require("mongoose")
const {Schema} = mongoose

const ParticipantSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    amountOwed:{
        type: Number,
    }
});

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
        type: [ParticipantSchema],
    },
    date:{
        type: Date,
        default: Date.now,
    },
    


})