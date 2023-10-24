const { v4: uuidv4 } = require('uuid');

const AppError = require('../utils/appError');
const aws = require('../utils/aws');

const generateUniqueName = function (originalName, userId) {
  const extension = path.extname(originalName);
  const timestamp = Date.now();
  return `${userId}_${timestamp}${extension}`;
};

exports.uploadFiles = async (files, res, next, validationTypes) => {
  if (files.length === 0 || !files)
    return next(new AppError('No hay archivos para subir'));

  files.forEach((f) => {
    if (!validationTypes.includes(f.mimetype))
      return next(new AppError('Los archivos no son válido', 400));
  });

  return await Promise.all(
    files.map((f, index) =>
      aws
        .uploadFile(`sucursal/${uuidv4()}-${index}`, f.buffer)
        .then((data) => ({
          location: data.Location,
          key: data.Key,
        }))
    )
  );
};

exports.deleteFiles = async (files) => {
  return await Promise.all(
    files.map((f) =>
      aws
        .deleteFile(f.key)
        .then(() => `Eliminado archivo ${f.key}`)
        .catch(() => `Error eliminando el archivo ${f.key}`)
    )
  );
};
