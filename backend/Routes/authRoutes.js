const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const {
  sendRegisterOtp,
  verifyRegisterOtp,
  register,
  login,
  sendForgotPasswordOtp,
  resetPassword,
} = require("../controller/authController");
const { getProfile, updateProfile } = require("../controller/userController");
const {sendMessage, getUserAllMessages,deleteUserMessage} = require('../controller/contactController')
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");



router.post("/send-otp", sendRegisterOtp);
router.post("/verify-otp", verifyRegisterOtp);
router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/forgot-password/reset", resetPassword);
// Profile upload storage
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const profileUpload = multer({ storage: profileStorage });

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getProfile);
router.put("/me", auth, profileUpload.single("profileImage"), updateProfile);

router.post("/send", sendMessage);
router.get('/messages',auth,isAdmin, getUserAllMessages);
router.delete('/messages/:id',auth,isAdmin, deleteUserMessage);
module.exports = router;
