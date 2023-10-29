require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const hbs = require('express-handlebars');
const route = require('./routes')
const cors = require('cors');
const db = require('./db');
app.use(cors());
db.connect();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use('/uploads', express.static('uploads'))

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
route(app);
app.engine('hbs', hbs.engine({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.listen(port, () => {
    console.log('Server run : http://localhost:' + port);
})
