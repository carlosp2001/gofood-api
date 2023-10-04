const express = require('express');
const passport = require('passport');

const authController = require('../controllers/authController');

const router = express.Router();

// Rutas autenticación con Google
router.get('/google',
  passport.authenticate('google',
    { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.PROJECT_URL}api/v1/auth/success`,
    failureRedirect: `${process.env.PROJECT_URL}api/v1/auth/failure`
  })
);


// Rutas autenticación con Facebook
router.get('/facebook',
  passport.authenticate('facebook',
    { scope: ['email'] }));


router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: `${process.env.PROJECT_URL}api/v1/auth/success`,
    failureRedirect: `${process.env.PROJECT_URL}api/v1/auth/failure`
  })
);

router.get('/success', authController.successAuth);

router.get('/failure', authController.failedAuth);

module.exports = router;