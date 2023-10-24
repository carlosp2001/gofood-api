const express = require('express');
const multer = require('../utils/multer');

const sucursalController = require('../controllers/sucursalController');

const router = express.Router();

router.get('/', sucursalController.getAllSucursals);
router.post('/', multer.upload.array('image', 5), sucursalController.createSucursal);
router.patch('/:id', multer.upload.array('image', 5), sucursalController.updateSucursal);
router.delete('/:id', sucursalController.deleteSucursal);

module.exports = router;