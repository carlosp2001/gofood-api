const express = require('express');

const Restaurant = require('../models/restaurantModel');
const restaurantController = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', restaurantController.getAllRestaurants);
router.post('/', restaurantController.createRestaurant);
router.patch('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);


module.exports = router;