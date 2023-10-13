const path = require('path');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const aws = require('../utils/aws');

const generateUniqueName = function(originalName, userId) {
  const extension = path.extname(originalName);
  const timestamp = Date.now();
  return `${userId}_${timestamp}${extension}`;
};

/**
 * Metodo para subir la imagen de perfil del usuario
 * @type {(function(*, *, *): *)|*}
 */
exports.uploadProfilePhoto = catchAsync(async (req, res, next) => {
  const file = req.file;

  if (!file) return next(new AppError('No hay ningun archivo para subir', 400));

  const validationTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (!validationTypes.includes(file.mimetype))
    return next(new AppError('El archivo es invalido', 400));

  const user = req.user;
  if (user.photo) await aws.deleteFile(`profile/${user.photo}`);
  // 6_1697232386900
  const uniqueName = generateUniqueName(file.originalname, user.id);

  const data = await aws.uploadFile(
    `profile/${uniqueName}`,
    file.buffer);

  user.photo = uniqueName;
  user.save();

  res.status(200).json({
    status: 'success',
    data: data.Location
  });
});

/**
 * Metodo para leer la imagen de perfil
 * @type {(function(*, *, *): *)|*}
 */
exports.readImage = catchAsync(async (req, res, next) => {
  const fileKey = req.params.image;
  if (!fileKey) return next(new AppError(''))
  const data = await aws.readFile(`profile/${fileKey}`);
  res.setHeader('Content-Type', data.ContentType);
  res.send(data.Body);
});