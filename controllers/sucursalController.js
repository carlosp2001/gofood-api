const factory = require('./handlerFactory');
const Sucursal = require('../models/sucursalModel');

const catchAsync = require('../utils/catchAsync');

exports.getAllSucursals = factory.getAll(Sucursal);

exports.updateSucursal = factory.updateOne(Sucursal);
exports.deleteSucursal = factory.deleteOne(Sucursal);

exports.createSucursal = catchAsync(async (req, res) => {
  console.log(req.body);

  const result = await Sucursal.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: result,
    },
  });
})