const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.login);
router.patch(
  "/updatepassword",
  authController.protect,
  authController.updatePassword
);
router.delete("/deleteuser", authController.deleteuser);
router.get(
  "/getprotectdata",
  authController.protect,
  authController.getalldata
);
router.get("/home", authController.homepage);
module.exports = router;
