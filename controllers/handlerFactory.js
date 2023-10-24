const uuidValidate = require('uuid-validate');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Sucursal = require('../models/sucursalModel');
const fileController = require('../controllers/fileController');
const _ = require('lodash');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findAll();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: data.length,
      data,
    });
    // console.log(err);
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!uuidValidate(req.params.id))
      return next(new AppError('El id del registro no es válido', 404));

    const result = await Model.findByPk(req.params.id);

    if (!result) return next(new AppError('Registro no encontrado', 404));

    res.status(200).json({
      status: 'success',
      data: result,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const result = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: result,
      },
    }); // El codigo 201 significado creado
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const existingRecord = await Model.findByPk(req.params.id);
    if (!existingRecord) {
      return next(new AppError('Ningún Registro encontrado', 404));
    }

    const updatedRecord = await existingRecord.update(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedRecord,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const existingRecord = await Model.findByPk(req.params.id);

    if (!existingRecord) {
      return next(new AppError('No se encontró ningún registro', 404));
    }

    await existingRecord.destroy();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.createOneWithFiles = (Model, validationTypes, fileColumn) =>
  catchAsync(async (req, res, next) => {
    // 1) Se construye el modelo
    const newRecord = Model.build(req.body);

    // 2) Se realiza la primer validación
    await newRecord.validate();

    // 3) Se define la variable que contendrá los archivos
    let files;

    // 4) Se comienzan a subir los archivos
    try {
      if (req.files.length > 0 && req.files) {
        files = await fileController.uploadFiles(
          req.files,
          res,
          next,
          validationTypes
        );

        // 5) Si los archivo se suben correctamente se agregara el campo
        // destinado al registro
        req.body[fileColumn] = files;
      }

      // 6) Se procede a la creación del registro con los archivos agregados
      const result = await Model.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          data: result,
        },
      });
    } catch (e) {
      // 7) De haber algún error se borrará los archivos que fueron subidos
      if (req.files.length > 0 && req.files && files) {
        console.log(await fileController.deleteFiles(files));
      }

      res.status(400).json({
        status: 'fail',
        error: e.message,
      });
    }
  });

exports.updateOneWithFiles = (Model, validationTypes, fileColumn) =>
  catchAsync(async (req, res, next) => {
    // 1) Encontrar el registro a actualizar
    const existingRecord = await Model.findByPk(req.params.id);

    // 2) Si no existe ningún registro mandamos el error
    if (!existingRecord)
      return next(new AppError('Ningún Registro encontrado', 404));

    // 3) Se definen las variables de los archivos
    let currentFiles;
    let files;

    // 4) Recibimos los campos que se actualizarán
    const updatedData = req.body;

    // 5) Recorremos las keys de cada campo que será actualizado
    Object.keys(updatedData).forEach((data) => {
      existingRecord[data] = updatedData[data];
    });

    // 6) Una vez realizado los cambios procedemos a validarlos
    await existingRecord.validate();

    // 7) De ser los campos válidos comienzan los archivos a subirse
    if (req.files.length > 0 && req.files) {
      // 8) Guardar las imágenes actuales del registro
      currentFiles = _.cloneDeep(existingRecord[fileColumn]);

      // 9) Subir las nuevas imágenes
      files = await fileController.uploadFiles(
        req.files,
        res,
        next,
        validationTypes
      );

      req.body[fileColumn] = files;
    }

    // 10) Se guarda en el nuevo registro
    let updatedRecord;

    // 11) En el try catch se realiza el update
    try {
      updatedRecord = await existingRecord.update(req.body);
    } catch (e) {
      // 12) De haber algún error se eliminarán del bucket las nuevas imágenes
      // que se subieron, las antiguas imágenes se mantendrán
      console.log(e);
      console.log(await fileController.deleteFiles(files));
      return next(new AppError(e.message));
    }

    // 13) De guardarse el nuevo registro con éxito los antiguos archivos se
    // eliminarán
    if (files && currentFiles)
      console.log(await fileController.deleteFiles(currentFiles));

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedRecord,
      },
    });
  });
