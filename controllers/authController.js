const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption);

  // Remueve la contraseña del output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

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

  if (!existUser)
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