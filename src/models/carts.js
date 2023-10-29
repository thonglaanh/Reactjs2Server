const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cart = new Schema({
    cars: { type: mongoose.Schema.Types.ObjectId, ref: 'cars' },
},
    {
        timestamps: true,
        collection: 'carts'
    });
module.exports = mongoose.model('carts', cart);