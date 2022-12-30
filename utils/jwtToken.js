const jwt = require("jsonwebtoken");
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTtoken();

  //cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // sameSite: "none",
    // secure: false,
  };
  user.password = undefined;
  res.status(statusCode).cookie("jwtToken", token, options).json({
    status: "success",
    token,
    user,
  });
};
module.exports = sendToken;
