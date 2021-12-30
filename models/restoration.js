const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restorationSchema = new Schema({
    ref: Number,
    application_type: String,
    PPO: {
        type: String,
        required: true
    },
    dateofbirth: String,
    name: String,
    basic: Number,
    bankname: String,
    branchname: String,
    accountno: Number,
    idno: Number,
    fileno: Number,
    mobileno: Number,
    application_date: String,
    status: String,
    User:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports= mongoose.model('restoration', restorationSchema);