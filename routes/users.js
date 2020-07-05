require("dotenv").config();
const app = require("express");
const router = app.Router();
// const jwt = require("jsonwebtoken");
const {
  loginController,
  registerController,
} = require("../controllers/userControllers");
// const { isName, isEmail } = require("../helpers/validators.js");
// const { fStore } = require("../fiyabase/index");
// const { hashPassword } = require("../helpers/hasher");

//refs
// const usersRef = fStore.collection("/users");

router.post("/register", registerController);

router.post("/login", loginController);

module.exports = router;
