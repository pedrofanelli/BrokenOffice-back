const express = require("express");
const router = express.Router();
const ResportsController = require("../controllers/reports");
const { validateOA, validateBeta, validateOAB } = require("../middleware");

router.get("/", validateOA, ResportsController.allReports);
router.get("/single/:reportId", ResportsController.oneReport);
router.get("/service", validateBeta, ResportsController.serviceReports);
router.get("/history", ResportsController.viewReports);
router.get("/geoffice", ResportsController.closestOffices);
router.post("/create", ResportsController.createReport);
router.post("/create/img", ResportsController.createReportImg);
router.post("/share", ResportsController.shareReport);
router.put(
  "/edit/state/:reportId",
  validateOAB,
  ResportsController.editReportState
);
router.delete("/delete/:reportId", validateOA, ResportsController.deleteReport);

module.exports = router;
