const factory = require('./handlerFactory');
const { AddonCategory, Addon } = require('../models/addonModel');
const catchAsync = require('../utils/catchAsync');

///////////////////////////////////////////////////////////////////////////////
// Complementos
exports.createAddon = factory.createOneWithFiles(
  Addon,
  ['image/png', 'image/jpg', 'image/jpeg'],
  'images'
);

exports.updateAddon = factory.updateOneWithFiles(
  Addon,
  ['image/png', 'image/jpg', 'image/jpeg'],
  'images'
);

///////////////////////////////////////////////////////////////////////////////
// Categoría de complementos
exports.getAllCategories = factory.getAll(AddonCategory);

exports.getAllCategoriesByRestaurant = catchAsync(async (req, res ) => {
  const data = await AddonCategory.findAll({
    where: { restaurantId: req.params.id },
  });

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    // requestedAt: req.requestTime,
    results: data.length,
    data,
  });
  // console.log(err);
});
exports.createAddonCategory = factory.createOne(AddonCategory);
exports.updateAddonCategory = factory.updateOne(AddonCategory);
exports.deleteAddonCategory = factory.deleteOne(AddonCategory);
