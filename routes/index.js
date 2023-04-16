const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const officesRouter = require("./offices");
const collaboratorsRouter = require("./collaborators");
const reportsRouter = require("./reports");
const chatsRouter = require("./chats")
const { validateUser } = require("../middleware/auth");

router.get("/", (req, res) => {
    res.send()
})
router.use("/user", userRouter);
router.use("/offices", validateUser, officesRouter);
router.use("/collaborators", validateUser, collaboratorsRouter);
router.use("/reports", validateUser, reportsRouter);
router.use("/chats", validateUser, chatsRouter)

module.exports = router;
