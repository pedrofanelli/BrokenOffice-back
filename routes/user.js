const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const { validateUser } = require("../middleware/auth");

router.get("/profile", validateUser, UserController.getProfile);
router.get("/me", validateUser, UserController.userMe);
router.post("/edit/picture", validateUser, UserController.editPicture);
router.post("/login", UserController.login);
router.post("/logout", validateUser, UserController.logoutUser);
router.post("/restore/password", UserController.generateLink);
router.post("/restore/password/:token", UserController.restorePassword);
router.put("/edit/profile", validateUser, UserController.editProfile);
router.put("/edit/password", validateUser, UserController.editPassword);

module.exports = router;
