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
    return next(new AppError('El correo ya existe', 401));


  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  //   role: req.body.role
  // });
  //
  // createSendToken(newUser, 201, res);
});

exports.successAuth = catchAsync(async (req, res, next) => {
  const existUser = await User.findOne({
    where: { email: req.user.email }
  });

  if (existUser && existUser.provider !== 'google')
    return next(new AppError('El correo ya existe', 401));

  if (existUser?.provider === 'google')
    return createSendToken(existUser, 201, res);

  console.log(req.user);

  const newUser = await User.create({
    first_name: req.user.given_name,
    last_name: req.user.family_name,
    email: req.user.email,
    // passwordConfirm: req.body.passwordConfirm,
    provider: 'google',
    role: 'user'
  });

  console.log(newUser);

  createSendToken(newUser, 201, res);
});