const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('./appError');
const catchAsync = require('./catchAsync');
const User = require('../models/userModel');
const { Sequelize } = require('sequelize');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

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

exports.verifyToken = async (token, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    where: {
      [Sequelize.Op.and]: [
        {
          passwordResetToken: hashedToken
        },
        {
          passwordResetExpires: {
            [Sequelize.Op.lt]: new Date('2023-10-06 05:41:50.690000 +00:00')
          }
        }
      ]
    }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    next(new AppError('El token es invalido o ha expirado', 400));
    return false;
  }

  return { user, token };
};

