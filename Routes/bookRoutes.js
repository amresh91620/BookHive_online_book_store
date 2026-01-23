const express = require("express");
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const {getAllBooks,addBook,updateBook,deleteBook} =require("../controller/bookController");


router.get('/',auth,isAdmin,getAllBooks);
router.post('/add-book',auth,isAdmin,addBook );
router.put('/update-book/:id',auth,isAdmin,updateBook);
router.delete('/delete-book/:id',auth,isAdmin,deleteBook)

module.exports = router; 