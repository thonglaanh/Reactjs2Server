

const mongooes = require('mongoose')
async function connect() {
    try {
        await mongooes.connect('mongodb://0.0.0.0:27017/project1');
        console.log('thanh cong')
    } catch (error) {
        console.log('that bai')
    }
}
module.exports = { connect };

