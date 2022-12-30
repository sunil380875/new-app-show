const express = require("express");
const path = require("path");
const cookieParse = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParse());
//_________________________________________________________________________//
//Router Middleware
const userRouter = require("./routes/userRouter");

app.use("/api/v1/user", userRouter);

module.exports = app;
