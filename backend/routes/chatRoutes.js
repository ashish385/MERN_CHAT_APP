const expres = require("express");
const protect = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatController");


const router = expres.Router();
router.route('/').post(protect, accessChat)
router.get("/", protect, fetchChats);
router.route("/group").post(protect,createGroupChat)
router.route('/rename').put(protect, renameGroup);
router.route('/add-to-group').put(protect, addToGroup);
router.route('/remove-from-group').put(protect, removeFromGroup);

module.exports = router;