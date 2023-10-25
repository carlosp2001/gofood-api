const factory = require('./handlerFactory');
const Restaurant = require('../models/restaurantModel');

exports.getAllRestaurants = factory.getAll(Restaurant);
exports.getOneRestaurant = factory.getOne(Restaurant);
exports.createRestaurant = factory.createOneWithFiles(
  Restaurant,
  ['image/png', 'image/jpg', 'image/jpeg'],
  'images'
);
exports.updateRestaurant = factory.updateOneWithFiles(
  Restaurant,
  ['image/png', 'image/jpg', 'image/jpeg'],
  'images'
);
exports.deleteRestaurant = factory.deleteOne(Restaurant);
