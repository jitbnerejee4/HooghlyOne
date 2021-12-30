const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
        },
    url: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
})

module.exports= mongoose.model('notification', notificationSchema);