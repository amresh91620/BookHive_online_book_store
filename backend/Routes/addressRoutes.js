const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controller/addressController");

// All address routes require authentication
router.use(authMiddleware);

router.get("/", getAddresses);
router.post("/", addAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
