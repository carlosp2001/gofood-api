const express = require('express');

const multer = require('../utils/multer');
const restaurantController = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', restaurantController.getAllRestaurants);
router.post('/', multer.upload.array('files', 1), restaurantController.createRestaurant);
router.get('/:id', restaurantController.getOneRestaurant);
router.patch('/:id', multer.upload.array('files', 1), restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);


module.exports = router;
