const express = require("express");
const router = express.Router();
const {
  sendRegisterOtp,
  verifyRegisterOtp,
  register,
  login,
  sendForgotPasswordOtp,
  resetPassword,
} = require('../controller/authController');
const {sendMessage, getUserAllMessages,deleteUserMessage} = require('../controller/contactController')
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');



router.post("/send-otp", sendRegisterOtp);
router.post("/verify-otp", verifyRegisterOtp);
router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/forgot-password/reset", resetPassword);
router.post("/register", register);
router.post("/login", login);

router.post("/send", sendMessage);
router.get('/messages',auth,isAdmin, getUserAllMessages);
router.delete('/messages/:id',auth,isAdmin, deleteUserMessage);
module.exports = router;
