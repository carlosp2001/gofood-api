const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/verifyToken', authController.verifyTokenPassword);
router.patch('/resetPassword', authController.resetPassword);

router.use(authController.protect);
router.get('/me', userController.getUser);

module.exports = router;