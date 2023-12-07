const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getAllUser,
} = require("../controllers/usercontroller");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/getAll", getAllUser);
module.exports = router;
