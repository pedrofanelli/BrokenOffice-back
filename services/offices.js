const { Office } = require("../models");

class OfficesServices {
  static async getAll() {
    try {
      const allOffices = await Office.find({});
      return { error: false, data: allOffices };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async addNewOffice(office) {
    try {
      const newOffice = await Office.create(office);
      return { error: false, data: newOffice };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async editAnOffice(obj, officeId) {
    try {
      const updatedOffice = await Office.findByIdAndUpdate(officeId, obj, {
        new: true,
      });
      return { error: false, data: updatedOffice };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async deleteAnOffice(officeId) {
    try {
      const deletedOffice = await Office.findByIdAndRemove(officeId);
      return { error: false, data: deletedOffice };
    } catch (error) {
      return { error: true, data: error };
    }
  }
  
}

module.exports = OfficesServices;
