const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getUser = catchAsync(async (req, res, next) => {
  if (req.user) console.log(req.user);

  req.user.password = undefined;
  res.status(200).json({
    status: 'success',
    data: { data: req.user }
  });

});
