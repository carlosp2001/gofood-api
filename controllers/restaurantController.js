const factory = require('./handlerFactory');
const Restaurant = require('../models/restaurantModel');

exports.getAllRestaurants = factory.getAll(Restaurant);
exports.createRestaurant = factory.createOne(Restaurant);
exports.updateRestaurant = factory.updateOne(Restaurant);
exports.deleteRestaurant = factory.deleteOne(Restaurant);