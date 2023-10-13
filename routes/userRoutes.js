const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const fileController = require('../controllers/fileController');
const { upload } = require('../utils/multer');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-token', authController.verifyTokenPassword);
router.patch('/reset-password', authController.resetPassword);

router.use(authController.protect);

router.patch('/update-profile-photo',
  upload.single('image'),
  fileController.uploadProfilePhoto);
router.get('/me', userController.getUser);

module.exports = router;