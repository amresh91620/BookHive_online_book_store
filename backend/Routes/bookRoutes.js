const express = require("express");
const router = express.Router();
const { adminMiddleware } = require("../middleware/auth");
const { getAllBooks,addBook,updateBook,deleteBook} = require("../controller/bookController");
module.exports = router;

router.post('/add',adminMiddleware,addBook);
router.put('/update/:id',adminMiddleware,updateBook);
router.delete('/delete/:id',adminMiddleware.deleteBook);


router.get('/',getAllBooks);

module.exports = router;