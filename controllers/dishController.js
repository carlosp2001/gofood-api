const uuidValidate = require('uuid-validate');
const _ = require('lodash');

const catchAsync = require('../utils/catchAsync');
const Dish = require('../models/dishModel');
const { Addon } = require('../models/addonModel');
const fileController = require('./fileController');
const AppError = require('../utils/appError');

exports.getAllDishes = catchAsync(async (req, res, next) => {
  const data = await Dish.findAll({
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    // requestedAt: req.requestTime,
    results: data.length,
    data,
  });
});

exports.getOneDish = catchAsync(async (req, res, next) => {
  if (!uuidValidate(req.params.id))
    return next(new AppError('El id del registro no es válido', 404));

  const data = await Dish.findByPk(req.params.id, {
    include: Addon
  });

  if (!data)
    return next(new AppError('Ningún Registro encontrado', 404));

  res.status(200).json({
    status: 'success',
    data: data,
  });

})

exports.createDish = catchAsync(async (req, res, next) => {
  const newRecord = Dish.build(req.body);

  // 2) Se realiza la primera validación
  await newRecord.validate();

  // 3) Se define la variable que contendrá los archivos
  let files;

  // 4) Se comienzan a subir los archivos
  try {
    if (req.files?.length > 0 && req.files) {
      files = await fileController.uploadFiles(
        req.files,
        res,
        next,
        ['image/png'],
        'dishes'
      );

      // 5) Si los archivo se suben correctamente se agregara el campo
      // destinado al registro
      req.body['images'] = files;
    }

    let addons;

    if (req.body.addons) {
      addons = req.body.addons;
      addons.forEach((addon) => {
        Addon.findByPk(addon)
          .then((result) => {
            if (!result) {
              return next(
                new AppError('Alguno de los complementos no existe')
              );
            }
          })
          .catch((e) => console.log(e.message));
      });
    }

    // 6) Se procede a la creación del registro con los archivos agregados
    const result = await Dish.create(req.body);

    // De no haber ningún problema se procede a agregar los complementos a la
    // base de datos
    await result.addAddons(addons);

    let data = await Dish.findByPk(result.id, {
      include: Addon,
    });

    res.status(201).json({
      status: 'success',
      data,
    });
  } catch (e) {
    // 7) De haber algún error se borrará los archivos que fueron subidos
    if (req.files?.length > 0 && req.files && files) {
      console.log(await fileController.deleteFiles(files));
    }

    res.status(400).json({
      status: 'fail',
      error: e.message,
    });
  }
});

exports.updateDish = catchAsync(async (req, res, next) => {
  // Se verifica que exista un registro, el registro se devuelve conteniendo la
  // información también del complemento
  const existingRecord = await Dish.findByPk(req.params.id, {
    include: Addon,
  });

  if (!existingRecord)
    return next(new AppError('Ningún Registro encontrado', 404));

  const updatedData = req.body;

  Object.keys(updatedData).forEach((data) => {
    existingRecord[data] = updatedData[data];
  });

  await existingRecord.validate();

  console.log(existingRecord.toJSON());

  let currentFiles; // Esta variable almacena los archivos de existir que se
  // encuentran en el registro antes de modificar

  let files; // Esta variable almacena la información de los archivos que se
  // subirán al bucket

  // De subirse archivos entramos en esta condicional
  if (req.files?.length > 0 && req.files) {
    // Guardar las imágenes actuales del registro
    currentFiles = _.cloneDeep(existingRecord[fileColumn]);

    // Subir las nuevas imágenes
    files = await fileController.uploadFiles(
      req.files,
      res,
      next,
      ['image/png', 'image/jpg', 'image/jpeg'],
      'dish'
    );

    // Se agrega al body la información con las imágenes
    req.body['images'] = files;
  }

  let addons; // Esta variable almacena los addons
  if (req.body.addons) {
    addons = req.body.addons;
    // Mediante este loop validamos que existan estos complementos en la base
    // de datos para no tener problemas de validación
    addons.forEach((addon) => {
      Addon.findByPk(addon)
        .then((result) => {
          if (!result) {
            return next(
              new AppError('Alguno de los complementos no existe')
            );
          }
        })
        .catch((e) => console.log(e.message));
    });
  }

  // Variable que almacenara el registro actualizado
  let updatedRecord;

  try {
    updatedRecord = await existingRecord.update(req.body);

    // Se realiza la eliminacion de los complementos que no estarán en la
    // actualización
    if (addons) {
      await updatedRecord.addAddons(addons);
      const currentAddons = existingRecord.Addons?.map(
        (addon) => addon.id
      );
      const addonsToDelete = currentAddons?.filter(
        (id) => !addons?.includes(id)
      );
      await updatedRecord.removeAddons(addonsToDelete);
    }
  } catch (e) {
    // 12) De haber algún error se eliminarán del bucket las nuevas imágenes
    // que se subieron, las antiguas imágenes se mantendrán
    console.log(e);
    if (files) console.log(await fileController.deleteFiles(files));
    return next(new AppError(e.message));
  }

  if (files && currentFiles)
    console.log(await fileController.deleteFiles(currentFiles));

  const data = await Dish.findByPk(updatedRecord.id, {
    include: Addon,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data,
    },
  });
});

exports.deleteDish = catchAsync(async (req, res, next) => {
  const existingRecord = await Dish.findByPk(req.params.id, {
    include: Addon,
  });

  if (!existingRecord)
    return next(new AppError('Ningún Registro encontrado', 404));

  let currentFiles;

  if (existingRecord.images)
    currentFiles = _.cloneDeep(existingRecord['images']);

  await existingRecord.removeAddons();
  await existingRecord.destroy();

  if (currentFiles)
    console.log(await fileController.deleteFiles(currentFiles));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
