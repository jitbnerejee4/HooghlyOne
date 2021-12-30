const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema= new Schema({
    id:{
        type: Number,
        required: true,
        unique: true
    },
    ppono:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    mobileno:{
        type: String,
        required: true,
        unique: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    bankname: String,
    branchname: String,
    acno: Number,
    actype: String,
    address: String,
    dob: String,
    email: String,
    ppo_copy: {
        type: String,
        required: true
    },
    ppo_name: {
        type: String
    },
    profile_pic: {
        type: String
    },
    pic_name:{
        type: String
    },
    role:{
        type: Number,
        required: true
    },
    isApproved:{
        type: Boolean,
        required: true,
        default: false
    },
    restoration:{
        type: Schema.Types.ObjectId,
        ref: 'restoration'
    },
    deathintimation:{
        type: Schema.Types.ObjectId,
        ref: 'deathintimation'
    },
    eightyYears:{
        type: Schema.Types.ObjectId,
        ref: 'eightyYears'
    },
    eightyFive:{
        type: Schema.Types.ObjectId,
        ref: 'eightyFive'
    },
    ninety:{
        type: Schema.Types.ObjectId,
        ref: 'ninety'
    },
    ninetyfive:{
        type: Schema.Types.ObjectId,
        ref: 'ninetyfive'
    }
})
userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model('User', userSchema);