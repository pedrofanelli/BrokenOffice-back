const express = require("express");
const router = express.Router();
const CollaboratorsController = require("../controllers/collaborators");
const { validateOA, validateOmega} = require("../middleware");

router.get("/users", validateOA, CollaboratorsController.allUsers);
router.get("/:userId", validateOA, CollaboratorsController.singleUser);
router.post("/create/user", validateOA, CollaboratorsController.createUser);
router.put("/edit/type", validateOmega, CollaboratorsController.editUserType);
router.delete("/delete/:userEmail", validateOA, CollaboratorsController.deleteUser);

module.exports = router;
