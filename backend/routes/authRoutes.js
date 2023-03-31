const express = require("express");
const {
  signup,
  login,
  changePassword,
} = require("../controllers/authController");
const protect = require("../middlewares/protect-routes");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/changePassword").patch(protect, changePassword);

module.exports = router;
