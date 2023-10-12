const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { createSendToken, verifyToken } = require('../utils/createToken');


/**
 * Método para crear un usuario con el rol de usuario, metodo para registrarse
 * @type {(function(*, *, *): *)|*}
 */
exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  console.log(req.body.email);
  const existUser = await User.findOne({
    where: { email: req.body.email }
  });

  if (existUser)
    return next(new
    AppError('El correo ya existe, inicia sesión o recupera la contraseña',
      401));


  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    provider: 'email',
    password: req.body.password,
    role: 'user'
  });

  console.log(newUser);

  createSendToken(newUser, 201, res);
});

/**
 * Metodo para iniciar sesion por medio del correo.
 * @type {(function(*, *, *): *)|*}
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);

  if (!email || !password) {
    return next(new AppError('Por favor ingrese un correo y una contraseña',
      400));
  }

  const user = await User.findOne({ where: { email } });
  // console.log(user);

  if (!user) {
    return next(new AppError('Usuario no encontrado', 401));
  }

  if (!user.password || !await user.passwordValidation(password)) {
    return next(new AppError('Contraseña incorrecta', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});


/**
 * Metodo que verifica la autenticación cuando ha sido exitosa por medio de
 * social,
 * @type {(function(*, *, *): *)|*}
 */
exports.successAuth = catchAsync(async (req, res, next) => {
  const existUser = await User.findOne({
    where: { email: req.user.email }
  });

  // console.log(req.user);

  if (existUser &&
    (existUser.provider !== req.user.provider
      || existUser.providerId !== req.user.id))
    return next(new AppError('Hay un problema con la autenticación, inicia sesión con tu contraseña o restaura la contraseña', 401));

  if (existUser?.provider === req.user.provider)
    return createSendToken(existUser, 201, res);

  const newUser = await User.create({
    name: req.user.given_name,
    email: req.user.email,
    // passwordConfirm: req.body.passwordConfirm,
    provider: req.user.provider,
    providerId: req.user.id,
    role: 'user'
  });

  // console.log(newUser);

  createSendToken(newUser, 201, res);
});


/**
 * Metodo para verificar que la autenticacion se haya realizado bien con Auth0
 * y Apple
 * @type {(function(*, *, *): *)|*}
 */
exports.successAuthApple = catchAsync(async (req, res, next) => {
  res.redirect(auth0.buildAuthorizeUrl());
});


/**
 * Metodo que recibe una autenticación fallida por parte del social
 * @type {(function(*, *, *): *)|*}
 */
exports.failedAuth = catchAsync(async (req, res, next) => {
  next(new AppError('Error al intentar autenticarse', 401));
});

/**
 * Metodo para solicitar el token para restaurar la contraseña
 * @type {(function(*, *, *): *)|*}
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Conseguir el usuario obtenido de la POST Request
  const user = await User.findOne({
    where: { email: req.body.email }
  });

  if (!user) {
    return next(new AppError('Usuario no encontrado.', 404));
  }

  // 2) Generar el token para almacenar para restaurar contraseña
  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  await user.save();

  // 3) Enviarlo al correo del usuario
  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Este el código de recuperación ${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Tu código para restaurar tu contraseña (válido por 10 minutos)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token enviado con exito!'
    });
  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    console.log('error');
    return next(
      new AppError('Hubo un error enviando el token. Intenta de nuevo mas tarde!'),
      500
    );
  }
});

/**
 * Metodo para verificar si el token es válido
 * @type {(function(*, *, *): *)|*}
 */
exports.verifyTokenPassword = catchAsync(async (req, res, next) => {
  if (!await verifyToken(req.body.token, next)) return;
  res.status(200).json({
    status: 'success',
    message: `Token válido`
  });
});

/**
 * Metodo para verificar el token y actualizar la contraseña al mismo tiempo
 * @type {(function(*, *, *): *)|*}
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { user } = await verifyToken(req.body.token, next);

  if (!user) return;

  if (!req.body.password || !req.body.passwordConfirm) return next(new
  AppError('Ingrese los datos de la contraseña valido'));

  if (req.body.password !== req.body.passwordConfirm) return next(new
  AppError('Las contraseñas no son iguales', 400));

  user.password = req.body.password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  // console.log(user);

  // La actualización de la fecha en la que el usuario cambia la contraseña
  await user.save();

  createSendToken(user, 200, res);
});

/**
 * Middleware para verificar la autenticación del usuario y agregar la
 * información a la request
 * @type {(function(*, *, *): *)|*}
 */
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Obteniendo el token en caso de existir
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'No has iniciado sesión! Por favor inicia sesión',
        401
      )
    );
  }
  // 2) Verificación del token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // 3) Revisar si el usuario aun existe

  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'El usuario perteneciente a este token no existe'
      )
    );
  }

  // 4) Revisar si el usuario ha cambiado la contraseña después de haber emitido
  // el token
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Usuario recientemente cambió la contraseña! ' +
        'Por favor ingresa de nuevo',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});