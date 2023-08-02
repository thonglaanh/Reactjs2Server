const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admins = new Schema({
    account: { type: String },
    password: { type: String },
},
    {
        timestamps: true,
    });
module.exports = mongoose.model('admins', admins);
