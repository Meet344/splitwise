const mongoose = require("mongoose")
const {Schema} = mongoose;
const {currencyEnums} = "../Utils/enums.js"

const GroupSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    members:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    invitedUsers:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    currency:{
        type: String,
        enum: ['USD', 'INR', 'EUR', 'CAD'],
    }


});

const Group = mongoose.model('group', GroupSchema);
module.exports = Group;