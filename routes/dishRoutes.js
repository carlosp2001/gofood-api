const express = require('express');
const multer = require('../utils/multer');
const dishController = require('../controllers/dishController');

const router = express.Router();

router.get('/', dishController.getAllDishes);
router.get('/:id', dishController.getOneDish);

router.post(
  '/',
  multer.upload.array('files', 1),
  dishController.createDish
);

router.patch(
  '/:id',
  multer.upload.array('files', 1),
  dishController.updateDish
);

router.delete('/:id', dishController.deleteDish);

module.exports = router;
