const express = require("express");
const {
  createBroadcast,
  getAllBroadcasts,
  updateBroadcast,
  deleteBroadcast,
} = require("../Controllers/BroadcastController.js");

const router = express.Router();

router.post("/", createBroadcast);
router.get("/", getAllBroadcasts);
router.put("/:id", updateBroadcast);
router.delete("/:id", deleteBroadcast);

module.exports = router;
