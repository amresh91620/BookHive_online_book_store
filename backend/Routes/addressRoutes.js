const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controller/addressController");

router.get("/", auth, getAddresses);
router.post("/", auth, addAddress);
router.put("/:id", auth, updateAddress);
router.delete("/:id", auth, deleteAddress);

module.exports = router;
