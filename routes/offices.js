const express = require("express");
const router = express.Router();
const OfficesController = require("../controllers/offices");
const { validateOA } = require("../middleware");

router.get("/", OfficesController.getOffices);
router.post("/add", validateOA, OfficesController.addOffice);
router.put("/edit/:officeId", validateOA, OfficesController.editOffice);
router.delete("/delete/:officeId", validateOA, OfficesController.deleteOffice);

module.exports = router;
