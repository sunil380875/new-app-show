const User = require("./../model/User");
const catchAsync = require("./../middleware/catchAsyncError");
const AppError = require("./../utils/errorHandler");
const sendToken = require("./../utils/jwtToken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  if (!user) {
    return next(new AppError("something went wrong", 404));
  }
  sendToken(user, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please Enter Email or Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return next(new AppError("user not found", 404));
  }

  sendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.jwtToken) {
    token = req.cookies.jwtToken;
  }
  if (!token) {
    return next(new AppError("You dont have a pass to access", 404));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("You are not logged in", 404));
  }
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("You recently changed Password so login again", 404)
    );
  }
  req.user = freshUser;

  next();
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // get the user

  const user = await User.findById(req.user.id).select("+password");

  // check posted password is correct

  if (!(await bcrypt.compare(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your Password is wrong", 404));
  }
  //update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  sendToken(user, 200, res);
  next();
});
exports.deleteuser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: true,
  });
});
exports.getalldata = catchAsync(async (req, res, next) => {
  res.status(200).send({ title: "sunil kumar mishra" });
});
exports.homepage = catchAsync(async (req, res, next) => {
  res.status(200).send({ title: "This is my Home Page" });
});
