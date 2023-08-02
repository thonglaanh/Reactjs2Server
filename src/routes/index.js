const main = require('./main')
const account = require('./account')
const car = require('./car')

function route(app) {
    app.use('/account', account);
    app.use('/car', car);
    app.use('/', main);
}
module.exports = route;