const express = require('express');
const router = express.Router();


const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/',   multer, sauceCtrl.createSauce);
router.put('/:id',   multer, sauceCtrl.modifySauce);
router.delete('/:id',   sauceCtrl.deleteSauce);
router.get('/:id',   sauceCtrl.getOneSauce);
router.get('/',   sauceCtrl.getAllSauces);
router.post('/:id/like',  sauceCtrl.likeSauce);

module.exports = router;