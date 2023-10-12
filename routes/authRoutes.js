const express = require('express');
const passport = require('passport');

const authController = require('../controllers/authController');

const router = express.Router();


///////////////////////////////////////////////////////////////////////////////
// Auth Social

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


// Rutas autenticacion mediante auth0
// router.get('/apple', (req, res) => {
//   res.redirect(auth0.buildAuthorizeUrl());
// });

// router.get('/apple/callback', async (req, res) => {
//   const { code } = req.query;
//
//   try {
//     // Intercambia el código de autorización por un token de acceso
//     const token = await auth0.exchangeCode(code);
//
//     // Verifica si se ha obtenido un token de acceso
//     if (token) {
//       // Si se ha obtenido el token, significa que el inicio de sesión fue exitoso
//       // Puedes realizar acciones adicionales aquí, como guardar el token en una cookie o en una sesión de usuario.
//
//       // Redirige al usuario a la página de inicio o a la página deseada
//       console.log('exitoso');
//     } else {
//       // Si no se ha obtenido un token, el inicio de sesión no fue exitoso
//       // Puedes manejar el error o redirigir al usuario a una página de error
//       console.log('fallido');
//     }
//   } catch (error) {
//     // Maneja cualquier error que pueda ocurrir durante el proceso de inicio
//     // de sesión
//     console.error(error);
//   }
// })

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: `${process.env.PROJECT_URL}api/v1/auth/success`,
    failureRedirect: `${process.env.PROJECT_URL}api/v1/auth/failure`
  })
);

router.get('/success', authController.successAuth);

router.get('/failure', authController.failedAuth);


///////////////////////////////////////////////////////////////////////////////
// Rutas autenticación token

router.get('/refresh-token', authController.refreshToken);

module.exports = router;