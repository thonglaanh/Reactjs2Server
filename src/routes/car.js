const express = require('express')
const router = express.Router();
const carController = require('../controllers/car')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })



router.get('/addNew', carController.addNew);
router.get('/screenUpdate/:_id', carController.screenUpdate);
router.post('/screenUpdate/:_id', upload.single('image'), carController.update);
router.get('/delete/:_id', carController.delete);
router.post('/add', upload.single('image'), carController.add)
router.get('/client', carController.carClient);
router.get('/:_id', carController.detail);

router.get('/', carController.car);


module.exports = router;