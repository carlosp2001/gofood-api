const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const results = await Model.findAll();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: results.length,
      data: { results },
    });
    // console.log(err);
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
