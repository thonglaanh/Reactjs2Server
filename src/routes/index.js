const main = require('./main')
const account = require('./account')
const car = require('./car')
const cart = require('./cart')

function route(app) {
    app.use('/account', account);
    app.use('/car', car);
    app.use('/cart', cart);
    app.use('/', main);
}
module.exports = route;