const express = require('express')
const router = express.Router();
const accountController = require('../controllers/account')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

router.post('/screenUpdate/:_id', upload.single('image'), accountController.update);
router.get('/screenUpdate/:_id', accountController.screenUpdate);

router.get('/addNew', accountController.addNew);
router.get('/delete/:_id', accountController.delete);
router.post('/add', upload.single('image'), accountController.add)
router.post('/login', accountController.login);
router.get('/', accountController.account);

module.exports = router;