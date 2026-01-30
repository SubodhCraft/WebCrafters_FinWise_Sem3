const express = require("express");
const router = express.Router();

const { register } = require("../controllers/registerController");
const { login } = require("../controllers/loginController");
const { getProfile, updateProfile, getAllUsers, changePassword, uploadProfilePicture, deleteOwnAccount } = require("../controllers/userController");
const authGuard = require("../helpers/authGuard");
const upload = require("../middleware/upload");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authGuard, getProfile);
router.put("/profile", authGuard, updateProfile);
router.post("/change-password", authGuard, changePassword);
router.post("/upload-profile-picture", authGuard, upload.single('profilePicture'), uploadProfilePicture);
router.delete("/delete-account", authGuard, deleteOwnAccount);
router.get("/getAllUsers", authGuard, getAllUsers);

router.get('/get_all_users', getAllUsers);
module.exports = router;

