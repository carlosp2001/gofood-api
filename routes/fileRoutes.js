const express = require('express');
const fileController = require('../controllers/fileController');
const { upload } = require('../utils/multer');

const router = express.Router();

router.post('/upload', upload.single('image'), fileController.uploadProfilePhoto);
router.get('/read-file/:image', fileController.readImage);

module.exports = router;