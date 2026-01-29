const express = require("express");
const router = express.Router();
const {userRegister,userLogin} = require('../controller/authController');
const {sendMessage} = require('../controller/contactController')
const auth = require('../middleware/authMiddleware');


router.post("/register", userRegister);
router.post('/login',userLogin);

router.post("/send", sendMessage);
module.exports = router;