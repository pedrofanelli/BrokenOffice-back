const ReportsServices = require("../services/reports");
const UserServices = require("../services/user");
const { sendEmail } = require("../utils/nodemailer");
const { uploadImage } = require("../utils/uploadImg");
require("dotenv").config();
const { BETA } = process.env;
const sharp = require("sharp");

class ReportsController {
  static async allReports(req, res, next) {
    try {
      const { error, data } = await ReportsServices.getAllReports();
      if (error) return res.status(404).send(data);
      res.status(200).send(data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async oneReport(req, res, next) {
    try {
      const { reportId } = req.params;
      const { error, data } = await ReportsServices.getOneReport(reportId);
      if (error) return res.status(404).send(data);
      res.status(200).send(data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async viewReports(req, res, next) {
    try {
      const user = await UserServices.findOneByEmail(req.user.email);
      const { error, data } = await ReportsServices.getReports(user.data._id);
      if (error) return res.status(404).send(data);
      res.status(200).send(data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async serviceReports(req, res, next) {
    try {
      const user = await UserServices.findOneByEmail(req.user.email);
      const { error, data } = await ReportsServices.getServiceReports(
        user.data._id
      );
      if (error) return res.status(404).send(data);
      res.status(200).send(data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async createReport(req, res, next) {
    try {
      const user = await UserServices.findOneByEmail(req.user.email);
      if (user.error) return res.status(404).send(user.data);
      const report = req.body;
      const checkReports = await ReportsServices.getReports(
        user.data._id,
        "issuer"
      );
      const found = checkReports.data.find(
        (rep) =>
          rep.product === report.product &&
          rep.status !== "resolved" &&
          rep.status !== "rejected"
      );
      if (found)
        return res
          .status(404)
          .send("Active report already exists with this product");

      const service = await ReportsServices.selectService(
        report.office,
        user.data._id
      );
      if (service.error) return res.status(404).send(service.data);

      const { error, data } = await ReportsServices.createNewReport(
        report,
        user.data._id,
        service.data._id
      );
      if (error) return res.status(404).send(data);
      const reportPop = await data.populate(["issuer", "solver", "office"]);
      sendEmail(reportPop, 1);
      res.status(201).send(reportPop._id);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async editReportState(req, res, next) {
    try {
      const { reportId } = req.params;
      const { status } = req.body;
      let title, description;
      if (!req.body.title || !req.body.description) {
        title = "";
        description = "";
      } else {
        title = req.body.title;
        description = req.body.description;
      }
      const reason = { title: title, description: description };
      const { error, data } = await ReportsServices.editStateReport(
        reportId,
        status,
        reason
      );
      if (error) return res.status(404).send(data);
      if (data.status === "resolved") {
        sendEmail(data, 3);
      } else if (data.status === "rejected") {
        sendEmail(data, 4);
      }
      res.status(200).send(data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async deleteReport(req, res, next) {
    try {
      const { reportId } = req.params;
      const { error, data } = await ReportsServices.deleteReport(reportId);
      if (error) return res.status(404).send(data);
      res.status(204).send();
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async closestOffices(req, res, next) {
    try {
      const lat = Number(req.query.lat);
      const long = Number(req.query.long);
      const userCoor = {
        type: "Point",
        coordinates: [long, lat],
      };
      const { error, data } = await ReportsServices.nearOffices(userCoor);
      if (error) return res.status(404).send(data);
      if (req.user.office._id) {
        const noFavorite = data.filter(
          (office) => office._id.toString() !== req.user.office._id
        );
        const firstThree = noFavorite.slice(0, 3);
        return res.status(200).send(firstThree);
      }
      const firstThree = data.slice(0, 3);
      res.status(200).send(firstThree);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async shareReport(req, res, next) {
    try {
      const { reportId, emailTo } = req.body;
      const { error, data } = await ReportsServices.getOneReport(reportId);
      if (error) return res.status(404).send(data);
      sendEmail(data, 2, emailTo);
      res.status(200).send();
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async createReportImg(req, res, next) {
    try {
      const myFile = req.file;
      const metadata = await sharp(myFile.buffer).metadata();
      if (metadata.width > 2000 || metadata.height > 2000)
        return res.status(500).send("The image needs to be smaller");
      const imageUrl = await uploadImage(myFile);
      const { error, data } = await ReportsServices.setReportImg(imageUrl);
      if (error) return res.status(404).send(data);
      res.status(201).send(data.imgUrl);
    } catch (error) {
      res.status(404).send(error);
    }
  }
}

module.exports = ReportsController;
