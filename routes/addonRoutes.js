const express = require('express');

const multer = require('../utils/multer');
const addonController = require('../controllers/addonController');

const router = express.Router();

// Complementos
router.post(
  '/',
  multer.upload.array('files', 1),
  addonController.createAddon
);

router.patch(
  '/:id',
  multer.upload.array('files', 1),
  addonController.updateAddon
);

// Categoría de complementos
router.get('/:id/categories', addonController.getAllCategoriesByRestaurant)
router.get('/categories', addonController.getAllCategories)
router.post(
  '/categories',
  addonController.createAddonCategory
);
router.patch(
  '/categories/:id',
  addonController.updateAddonCategory
);
router.delete(
  '/categories/:id',
  addonController.deleteAddonCategory
);

module.exports = router;
