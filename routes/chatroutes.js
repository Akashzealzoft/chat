const express = require("express");
const { getAllChats, createMessage } = require("../controllers/chatcontroller");
const router = express.Router();

router.post("/getchat", getAllChats);
router.post("/createchat", createMessage);

module.exports = router;
