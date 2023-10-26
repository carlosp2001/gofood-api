const factory = require('./handlerFactory');
const { AddonCategory, Addon } = require('../models/addonModel');
const catchAsync = require('../utils/catchAsync');

///////////////////////////////////////////////////////////////////////////////
// Complementos
exports.getAllAddonsByRestaurant = catchAsync(async (req, res, next) => {
  await factory.getOneWithQuery(
    res,
    next,
    `select *
     from "Addons"
     where "Addons"."restaurantId" = '${req.params.id}'`
  );
});

exports.createAddon = factory.createOneWithFiles(
  Addon,
  ['image/png', 'image/jpg', 'image/jpeg'],
  'images',
  'addons'
);

exports.updateAddon = factory.updateOneWithFiles(
  Addon,
  ['image/png', 'image/jpg', 'image/jpeg'],
  'images',
  'addons'
);

exports.deleteAddon = factory.deleteOneWithFiles(Addon, 'images');

///////////////////////////////////////////////////////////////////////////////
// Categoría de complementos
exports.getAllCategories = factory.getAll(AddonCategory);

exports.getAllCategoriesByRestaurant = catchAsync(async (req, res, next) => {
  await factory.getOneWithQuery(
    res,
    next,
    `select *
     from "AddonCategories"
     where "AddonCategories"."restaurantId" = '${req.params.id}'`
  );
});

exports.createAddonCategory = factory.createOne(AddonCategory);
exports.updateAddonCategory = factory.updateOne(AddonCategory);
exports.deleteAddonCategory = factory.deleteOne(AddonCategory);
