const express = require('express')
const router = express.Router();
const mainController = require('../controllers/main')

router.get('/', mainController.screenlogin);
router.post('/login', mainController.login);
module.exports = router;