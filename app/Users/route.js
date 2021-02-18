var express = require("express");
var router = express.Router();

var Users = require("./model");
var userController = require("./controller");

router.get("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/validateotp",userController.validateOtp)
router.post("/register", userController.addUser);
router.get("/sendotp", userController.sendOtp);
router.get("/:id",userController.verifyId);

module.exports = router;