const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ninetySchema= new Schema({
    ref: Number,
    application_type: String,
    PPO: {
        type: String,
        required: true
    },
    dateofbirth: String,
    name: String,
    bankname: String,
    branchname: String,
    accountno: Number,
    idno: Number,
    fileno: Number,
    mobileno: Number,
    ageproof: {
        type: String,
        required: true
    },
    ageproof_filename: {
        type: String,
        required: true
    },
    application_date: String,
    status: String,
    User:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
module.exports= mongoose.model('ninety', ninetySchema);