const { User, Office, Restore } = require("../models");

class UserServices {
  static async findOneByEmail(email) {
    try {
      const singleUser = await User.findOne({ email }).populate("office");      
      return { error: false, data: singleUser };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async updateProfile(obj, email) {
    try {
      const userUpdated = await User.findOneAndUpdate({ email }, obj, {
        runValidators: true,
        new: true,
      }).populate("office");
      return { error: false, data: userUpdated };
    } catch (error) {
      return { error: true, data: error };
    }
  }
  
  static async updatePassword(password, user) {
    try {
      user.password = password;
      await user.save();
      return { error: false, data: user };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async createPassLink(email, token) {
    const expiration = new Date(Date.now() + 7200 * 1000)
    const tokenUrl = `http://localhost:3000/user/restore/password/${token}`;
    try {
      const exist = await Restore.findOne({ email });
      if (!exist) {
        await Restore.create({email, token, expiration})
        return { error: false, data: tokenUrl }
      }
      exist.token = token;
      exist.expiration = expiration;
      await exist.save()
      return { error: false, data: tokenUrl };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async validateLink(token) {
    try {
      const exist = await Restore.findOne({ token });
      return { error: false, data: exist };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async deleteLink(email) {
    try {
      const deleted = await Restore.deleteOne({ email });
      return { error: false, data: deleted };
    } catch (error) {
      return { error: true, data: error };
    }
  }
}

module.exports = UserServices;
