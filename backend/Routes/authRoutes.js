const express = require("express");
const router = express.Router();
const {userRegister,userLogin} = require('../controller/authController');
const {sendMessage, getUserAllMessages,deleteUserMessage} = require('../controller/contactController')
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');



router.post("/register", userRegister);
router.post('/login',userLogin);

router.post("/send", sendMessage);
router.get('/messages',auth,isAdmin, getUserAllMessages);
router.delete('/messages/:id',auth,isAdmin, deleteUserMessage);
module.exports = router;