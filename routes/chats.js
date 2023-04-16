const express = require("express");
const router = express.Router();
const ChatsController = require("../controllers/chats");

router.get("/history/:chatId", ChatsController.messageHistory);
router.get("/checkissuerlength/:chatRoom", ChatsController.checkIssuerLength);
router.get("/checksolverlength/:chatRoom", ChatsController.checkSolverLength);
router.get("/issuerinbox", ChatsController.issuerInbox);
router.get("/solverinbox", ChatsController.solverInbox);
router.post("/create", ChatsController.createChat);
router.post("/messages", ChatsController.addMessages);
router.post("/issuerlength", ChatsController.recordIssuerLength);
router.post("/solverlength", ChatsController.recordSolverLength);

module.exports = router;
