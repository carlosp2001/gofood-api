const AWS = require('aws-sdk');

// Configurar el SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const aws = new AWS.S3();

/**
 * Método para subir una archivo a S3
 * @param fileName
 * @param fileContent
 * @param route
 * @returns {Promise<unknown>}
 */
exports.uploadFile = function(fileName, fileContent, route) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'gofoodstorage',
      Key: fileName,
      Body: fileContent
    };

    aws.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // Borra el archivo temporal en el servidor
        // fs.unlinkSync(myPath + '/image.');
        resolve(data);
      }
    });
  });
};

exports.readFile = function(fileKey) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'gofoodstorage',
      Key: fileKey
    };
    aws.getObject(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

exports.deleteFile = function(fileKey) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'gofoodstorage',
      Key: fileKey
    };
    aws.deleteObject(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  })
}