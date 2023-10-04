const express = require('express');
const passport = require('passport');

const authController = require('../controllers/authController');

const router = express.Router();

router.get('/google',
  passport.authenticate('google',
    { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.PROJECT_URL}api/v1/auth/success`,
    failureRedirect: `${process.env.PROJECT_URL}api/v1/auth/failure`
  })
);

router.get('/success', authController.successAuth);

router.get('/failure', (req, res) => {
  res.status(400).json({
    status: 'fail'
  });
});

module.exports = router;