const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cars = new Schema({
    name: { type: String },
    brands: { type: mongoose.Schema.Types.ObjectId, ref: 'brands' },
    image: { type: String },
    price: { type: String },
    describe: { type: String },
    date: { type: String },
    quantity: { type: String },
    availableColors: [{ type: String }],
    selectColor: { type: String }

},
    {
        timestamps: true,
    });
module.exports = mongoose.model('cars', cars);
