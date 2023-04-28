const UserServices = require("../services/user");
const { generatePayloadRestore } = require("../utils/generatePayRest");
const { generatePayload } = require("../utils/generatePayload");
const { sendEmail } = require("../utils/nodemailer");
const { uploadImage } = require("../utils/uploadImg");
const sharp = require("sharp");

class UserController {
  static async getProfile(req, res, next) {
    const { email } = req.user;
    try {
      const { error, data } = await UserServices.findOneByEmail(email);
      if (error) return res.status(404).send(data);
      res.status(200).send(req.user);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async editProfile(req, res, next) {
    const { email } = req.user;
    try {
      const { error, data } = await UserServices.updateProfile(req.body, email);
      if (error) {
        return res.status(404).send(data);
      }
      const { token, payload } = generatePayload(data);
      res.cookie("token", token);
      res.status(200).send({ user: payload, token: token });
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async editPassword(req, res, next) {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.user;
    try {
      const user = await UserServices.findOneByEmail(email);
      if (user.error) return res.status(404).send(user.data);
      const isValid = await user.data.validatePassword(oldPassword);
      if (!isValid) return res.status(401).send("Invalid credentials");
      const updatedUser = await UserServices.updatePassword(
        newPassword,
        user.data
      );
      if (updatedUser.error) return res.status(404).send(updatedUser.data);
      sendEmail(user.data, 6);
      res.status(200).send("Password updated successfully");
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const { error, data } = await UserServices.findOneByEmail(email);
      if (error) return res.status(404).send(data);
      if (!data) return res.status(401).send("Invalid credentials");
      const isValid = await data.validatePassword(password);
      if (!isValid) return res.status(401).send("Invalid credentials");
      const { token, payload } = generatePayload(data);
      res.cookie("token", token, { sameSite: 'none', secure: true });
      res.status(200).send({ user: payload, token: token });
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async userMe(req, res, next) {
    res.status(200).send(req.user);
  }

  static async logoutUser(req, res, next) {
    res.clearCookie("token").status(204).send();
  }

  static async editPicture(req, res, next) {
    const { email } = req.user;
    const myFile = req.file;
    try {
      const metadata = await sharp(myFile.buffer).metadata();
      if (metadata.width > 2000 || metadata.height > 2000)
        return res.status(500).send("The image needs to be smaller");
      const imageUrl = await uploadImage(myFile);
      const { error, data } = await UserServices.updateProfile(
        { picture: imageUrl },
        email
      );
      if (error) {
        return res.status(404).send(data);
      }
      const { token, payload } = generatePayload(data);
      res.cookie("token", token);
      res.status(201).send({ user: payload, token: token });
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async generateLink(req, res, next) {
    const { email } = req.body;
    try {
      const { error, data } = await UserServices.findOneByEmail(email);
      if (error) return res.status(404).send(data);
      if (!data) return res.status(404).send("Invalid credentials")
      const { token, payload } = generatePayloadRestore(data)
      const withoutDot = token.replace(/\./g, "");
      const tokenUrl = await UserServices.createPassLink(email, withoutDot)
      if (tokenUrl.error) return res.status(404).send("Invalid credentials");
      data.tokenUrl = tokenUrl.data
      sendEmail(data, 5);
      res.status(200).send();
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async restorePassword(req, res, next) {
    const { password } = req.body;
    const { token } = req.params
    try {
      const valid = await UserServices.validateLink(token)
      if (valid.error) return res.status(404).send(valid.data);
      if (!valid.data) return res.status(404).send("No data");
      const user = await UserServices.findOneByEmail(valid.data.email);
      if (user.error) return res.status(404).send(user.data);
      if (!user.data) return res.status(404).send("No data");
      const updatedUser = await UserServices.updatePassword(
        password,
        user.data
      );
      if (updatedUser.error) return res.status(404).send(updatedUser.data);
      await UserServices.deleteLink(valid.data.email)
      sendEmail(user.data, 6);
      res.status(200).send("Password updated successfully");
    } catch (error) {
      res.status(404).send(error);
    }
  }
}

module.exports = UserController;
