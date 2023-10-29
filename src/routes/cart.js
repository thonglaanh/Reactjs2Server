const express = require('express')
const router = express.Router();
const Cart = require('../models/carts');
router.get('/', (req, res) => {
    Cart.find({}).populate('cars').then((cart) => {
        res.json(cart)
    })
});
module.exports = router;