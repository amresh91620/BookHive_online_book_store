const express = require("express");
const router = express.Router();
const {getAllUser,addBook,getAllBooks,deleteUser,updateBook,deleteBook} = require('../controller/adminController');


router.get('/users',getAllUser);
router.delete('/users/delete/:id',deleteUser);
router.get('/books',getAllBooks);
router.post('/addBook',addBook);
router.patch('/books/update/:id',updateBook);
router.patch('/books/delete/:id',deleteBook);






module.exports = router;