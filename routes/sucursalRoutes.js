const express = require('express');
const multer = require('../utils/multer');

const sucursalController = require('../controllers/sucursalController');

const router = express.Router();

router.get('/', sucursalController.getAllSucursals);
router.post(
  '/',
  multer.upload.array('files', 3),
  sucursalController.createSucursal
);
router.get('/:id', sucursalController.getOneSucursal);
router.patch(
  '/:id',
  multer.upload.array('image', 5),
  sucursalController.updateSucursal
);
router.delete('/:id', sucursalController.deleteSucursal);

module.exports = router;
