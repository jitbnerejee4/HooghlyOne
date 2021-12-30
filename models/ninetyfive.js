const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ninetyfiveSchema= new Schema({
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
    application_date: String,
    ageproof: {
        type: String,
        required: true
    },
    ageproof_filename: {
        type: String,
        required: true
    },
    status: String,
    User:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
module.exports= mongoose.model('ninetyfive', ninetyfiveSchema);