const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitorSchema= new Schema({
    name: String,
    count: Number
    
})
module.exports= mongoose.model('Visitor', visitorSchema);