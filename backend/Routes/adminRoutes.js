const express =require("express");
const router = express.Router()
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const {getDashboardStats,getAllUser,deleteUser} = require("../controller/adminController");



router.get("/Dashboard",auth,isAdmin,getDashboardStats);
router.get("/users",auth,isAdmin,getAllUser);
router.delete("/users/:id",auth,isAdmin,deleteUser);


module.exports = router;