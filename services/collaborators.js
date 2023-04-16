const { User, Report } = require("../models");
const ReportsServices = require("./reports");
const { selectService } = require("./reports");
require("dotenv").config();
const { BETA } = process.env;

class CollaboratorsServices {
  static async fetchAllUsers() {
    try {
      const users = await User.find({});
      return { error: false, data: users };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async findUserById(userId) {
    try {
      const singleUser = await User.findById(userId);
      return { error: false, data: singleUser };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async findUser(email) {
    try {
      const userExists = await User.find({ email });
      return { error: false, data: userExists };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async createNewUser(info) {
    try {
      const newUser = await User.create(info);
      return { error: false, data: newUser };
    } catch (error) {
      return { error: true, data: error };
    }
  }
  
  static async editType(email, type) {    
    try {      
      const privilegesUpdated = await User.findOneAndUpdate({ email }, {type})
      return { error: false, data: privilegesUpdated };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async removeUser(email) {        
    try {      
      const removedUser = await User.deleteOne({ email });
      return { error: false, data: removedUser };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async delegateReports(email) {    
    try {      
      const user = await User.findOne({email})
      if (user.activeReports && user.type === BETA) {
        const reports = await Report.find({solver: user._id, status: { $in: ['issued', 'in progress'] }})
        const newService = await ReportsServices.selectService(user.office, user._id)
        if (newService.error) return res.status(404).send(newService.data);
        for (let i = 0; i < reports.length; i++) {
          reports[i].solver = newService.data._id
          reports[i].save()
          newService.data.activeReports += 1;
          newService.data.save()
          user.activeReports -= 1;
          user.save();
        }
      }
      return { error: false, data: user };
    } catch (error) {
      return { error: true, data: error };
    }
  }
}

module.exports = CollaboratorsServices;
