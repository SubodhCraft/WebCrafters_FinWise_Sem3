const express = require("express");
const router = express.Router();

const { register } = require("../controllers/registerController");
const { login } = require("../controllers/loginController");
const { getProfile, updateProfile, getAllUsers } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);

router.get("/getAllUsers", getAllUsers);
router.get("/getUserById/:id", getProfile);
router.put("/updateUserById/:id", updateProfile);

router.get('get_all_users', getAllUsers);
module.exports = router;
