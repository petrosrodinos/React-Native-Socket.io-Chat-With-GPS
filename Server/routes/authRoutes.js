const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { check } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");

router.post(
  "/login",
  [
    check("phone").not().isEmpty().isLength({ min: 3, max: 20 }),
    check("password").not().isEmpty().isLength({ min: 5, max: 30 }),
  ],
  authController.login
);

router.post(
  "/register",
  [
    check("username").not().isEmpty().isLength({ min: 3, max: 20 }),
    check("email").not().isEmpty().isEmail(),
    check("phone").not().isEmpty().isLength({ min: 5, max: 10 }),
    check("password").not().isEmpty().isLength({ min: 5, max: 30 }),
  ],
  authController.register
);

router.route("/").get(protect, authController.allUsers);

module.exports = router;
