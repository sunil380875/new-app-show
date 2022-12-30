const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "A user user must have a email"],
    validate: [validator.isEmail, "Please Enter Correct"],
  },
  password: {
    type: String,
    required: [true, "A user user must have a email"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Please confirm your password",
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
});

userSchema.methods.getJWTtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
userSchema.methods.changedPasswordAfter = function (JwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JwtTimeStamp < changedTimeStamp;
  }
  return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
