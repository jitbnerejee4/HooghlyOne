const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deathIntimationSchema = new Schema({
    ref: Number,
    application_type: String,
    PPO: {
        type: String,
        required: true
    },
    name: String,
    dateofdeath: String,
    bankname: String,
    branchname: String,
    accountno: Number,
    idno: Number,
    fileno: Number,
    applicantname: String,
    relation: String,
    mobileno: Number,
    application_date: String,
    ppo_copy: {
        type: String,
        required: true
    },
    ppofilename: {
        type: String,
        required: true
    },
    deathcertificate: {
        type: String,
        required: true
    },
    deathfilename: {
        type: String,
        required: true
    },
    status: {
        type: String,
        
    },
    User:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports= mongoose.model('deathintimation', deathIntimationSchema);