const CollaboratorsServices = require("../services/collaborators");
const ReportsServices = require("../services/reports");
const UserServices = require("../services/user");
require("dotenv").config();
const { ALPHA, ALPHAT, OMEGA } = process.env;

class CollaboratorsController {
  static async allUsers(req, res, next) {
    try {
      const { error, data } = await CollaboratorsServices.fetchAllUsers();
      if (error) return res.status(404).send(data);
      res.status(200).send(data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async singleUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { error, data } = await CollaboratorsServices.findUserById(userId);
      if (error) return res.status(404).send(data);
      const reports = await ReportsServices.getReports(userId);
      if (reports.error) return res.status(404).send(reports.data);
      res.status(200).send({user: data, reports: reports.data});
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      if(req.user.type === ALPHA && req.body.type === ALPHAT){
        return res.status(401).send("Invalid credentials")
      }
      const userExists = await CollaboratorsServices.findUser(req.body.email);
      if (!userExists.error && userExists.data.length)
        return res.status(404).send("That user already exists");

      const { error, data } = await CollaboratorsServices.createNewUser(req.body);
      if (error) return res.status(404).send(data);
      res.status(201).send("User created successfully");
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async editUserType(req, res, next) {
    const { email, type } = req.body;
    try {
      const updatedUser = await CollaboratorsServices.delegateReports(email);
      if (updatedUser.error) return res.status(404).send(updatedUser.data);
      const { error, data } = await CollaboratorsServices.editType(email, type);
      if (error) return res.status(404).send(data);
      res.status(200).send("User updated successfully");
    } catch (error) {
      res.status(404).send(error);
    }
  }
  
  static async deleteUser(req, res, next) {
    const { userEmail } = req.params;
    try {
      const user = await UserServices.findOneByEmail(userEmail)
      if (req.user.type === ALPHA && user.data.type === ALPHA){
        return res.status(401).send("Invalid credentials")
      }
      if (user.data.type === OMEGA){
        return res.status(401).send("Super Admin cannot be deleted")
      }
      const { error, data } = await CollaboratorsServices.removeUser(userEmail);
      if (error) return res.status(404).send(data);
      res.status(204).send();
    } catch (error) {
      res.status(404).send(error);
    }
  }
}

module.exports = CollaboratorsController;
