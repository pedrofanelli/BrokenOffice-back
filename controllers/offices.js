const OfficesServices = require("../services/offices");

class OfficesController {
  static async getOffices(req, res, next) {
    try {
      const { error, data } = await OfficesServices.getAll();
      if (error) return res.status(404).send(data);
      res.status(200).send(data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async addOffice(req, res, next) {
    try {
      const { error, data } = await OfficesServices.addNewOffice(req.body);
      if (error) return res.status(404).send(data);
      res.status(201).send(data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async editOffice(req, res, next) {
    try {
      const { officeId } = req.params;
      const { error, data } = await OfficesServices.editAnOffice(
        req.body,
        officeId
      );
      if (error) {
        return res.status(404).send(data);
      }
      res.status(200).send("Office updated successfully");
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async deleteOffice(req, res, next) {
    try {
      const { officeId } = req.params;
      const { error, data } = await OfficesServices.deleteAnOffice(officeId);
      if (error) return res.status(404).send(data);
      res.status(204).send();
    } catch (error) {
      res.status(404).send(error);
    }
  }
}

module.exports = OfficesController;
