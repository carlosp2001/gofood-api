const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createSendToken = require('../utils/createToken');

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

  if (!email || !password) {
    return next(new AppError('Por favor ingrese un correo y una contraseña',
      400));
  }

  const user = await User.findOne({ where: { email } });
  // console.log(user);

  if (!user) {
    return next(new AppError('Usuario no encontrado', 401));
  }

  if (!await user.passwordValidation(password) || !user.password) {
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

  console.log(req.user);

  if (existUser &&
    (existUser.provider !== req.user.provider
      || existUser.providerId !== req.user.id))
    return next(new AppError('Hay un problema con la autenticación, intenta ' +
      'recuperar tu contraseña', 401));

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

  console.log(newUser);

  createSendToken(newUser, 201, res);
});

exports.failedAuth = catchAsync(async (req, res, next) => {
  next(new AppError('Error al intentar autenticarse', 401));
});