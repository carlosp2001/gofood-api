const _ = require('lodash');

const factory = require('./handlerFactory');
const Sucursal = require('../models/sucursalModel');
const catchAsync = require('../utils/catchAsync');
const fileController = require('../controllers/fileController');
const AppError = require('../utils/appError');

exports.getAllSucursals = factory.getAll(Sucursal);
exports.getOneSucursal = factory.getOne(Sucursal);

exports.deleteSucursal = catchAsync(async (req, res, next) => {
  const existingSucursal = await Sucursal.findByPk(req.params.id);

  if (!existingSucursal)
    return next(new AppError('Ningún Registro encontrado', 404));

  const currentImages = _.cloneDeep(existingSucursal.images);

  await existingSucursal.destroy();
  console.log(await fileController.deleteFiles(currentImages));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createSucursal = factory.createOneWithFiles(Sucursal, [
  'image/png',
  'image/jpg',
  'image/jpeg',
], 'images');

exports.updateSucursal = catchAsync(async (req, res, next) => {
  // 1) Encontrar el registro a actualizar
  const existingSucursal = await Sucursal.findByPk(req.params.id);

  if (!existingSucursal)
    return next(new AppError('Ningún Registro encontrado', 404));

  let currentImages;
  let images;

  if (req.files.length > 0 && req.files) {
    console.log('true');
    // 2) Guardar las imagenes actuales del registro
    currentImages = _.cloneDeep(existingSucursal.images);

    const validationTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    // 3) Subir las nuevas imagenes
    images = await fileController.uploadFiles(
      req.files,
      res,
      next,
      validationTypes
    );

    req.body.images = images;
  }

  // 4) Se guarda en el nuevo registro
  const updatedRecord = await existingSucursal.update(req.body);

  if (req.files.length > 0 && req.files)
    console.log(await fileController.deleteFiles(currentImages));

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedRecord,
    },
  });
});
