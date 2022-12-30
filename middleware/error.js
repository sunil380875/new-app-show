const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //    WRONG MONGO ID

  if (err.name === "CastError") {
    const message = `Resource not found with this Id or Invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //MOGOOSE DUPLICATE EMAIL ID
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //iNVALID jSON tOKEN
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid ,please Try again`;
    err = new ErrorHandler(message, 400);
  }

  //JSon web token expired error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is invalid ,please Try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err.stack,
  });
};

// FIRST CREATE A UTIL FOLDER THeN create A ERRORHANDLE FILE IN UTIL AND THEN MAKE OBJECT OF THAT CLASS WHEREVER REQUIRED
