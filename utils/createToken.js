const jwt = require('jsonwebtoken');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

module.exports = (user, statusCode, res) => {
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