const express = require('express');

const Sucursal = require('../models/sucursalModel');
const sucursalController = require('../controllers/sucursalController');

const router = express.Router();

router.get('/', sucursalController.getAllSucursals);
router.post('/', sucursalController.createSucursal);
router.patch('/:id', sucursalController.updateSucursal);
router.delete('/:id', sucursalController.deleteSucursal);


module.exports = router;