const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getUser = catchAsync(async (req, res, next) => {
  if (req.user) console.log(req.user);

  res.status(200).json({
    status: 'success',
    data: { data: req.user }
  });

  // const tour = tours.find((el) => el.id === id);

  // console.log(tour);
  // res.status(200).json({
  //     status: 'success',
  //     data: { tour },
  // });
});
