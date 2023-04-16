const ChatServices = require("../services/chats");
const UserServices = require("../services/user");

class ChatsController {
  static async createChat(req, res, next) {
    try {
      const { room } = req.body;
      const { error, data } = await ChatServices.createNewChat(room);
      if (error) return res.status(404).send(data);
      res.status(201).send(data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async addMessages(req, res, next) {
    try {
      const email = req.user.email;
      const { msg, room } = req.body;
      const user = await UserServices.findOneByEmail(email);
      if (user.error) return res.status(404).send(user.data);
      const userId = user.data._id;
      const newMessage = await ChatServices.addMessages(msg, room, userId);
      if (newMessage.error) return res.status(404).send(newMessage.data);
      res.status(201).send(newMessage.data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async messageHistory(req, res, next) {
    try {
      const email = req.user.email;
      const { chatId } = req.params;
      // const {issuer} = req.query;
      // const {solver} = req.query;
      const user = await UserServices.findOneByEmail(email);
      if (user.error) return res.status(404).send(user.data);
      // if (user.data._id !== issuer || user.data._id !== solver) {
      //     return res.status(401).send("Invalid credentials")
      // }
      const chatHistory = await ChatServices.getChatHistory(chatId);
      if (chatHistory.error) return res.status(404).send(chatHistory.data);
      res.status(200).send(chatHistory.data.allMessages);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async recordIssuerLength(req, res, next) {
    try {
      const email = req.user.email;
      const { chatLength, chatId, chatRoom } = req.body;
      const updatedUser = await ChatServices.recordIssuerLength(
        email,
        chatLength,
        chatId,
        chatRoom
      );
      res.status(200).send(updatedUser.data);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async recordSolverLength(req, res, next) {
    try {
      const email = req.user.email;
      const { chatLength, chatId, chatRoom } = req.body;
      const updatedUser = await ChatServices.recordSolverLength(
        email,
        chatLength,
        chatId,
        chatRoom
      );
      res.status(200).send(updatedUser);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async checkIssuerLength(req, res, next) {
    try {
      const email = req.user.email;
      const { chatRoom } = req.params;
      const chatLength = await ChatServices.getChatLength(chatRoom);
      if (chatLength.error) return res.status(404).send(chatLength.data);
      const user = await UserServices.findOneByEmail(email);
      if (user.error) return res.status(404).send(user.data);
      const issuerLength = user.data.issuerMessages.find(
        (chat) => chat.chatRoom === chatRoom
      ).chatLength;
      const notifications = chatLength.data - issuerLength;
      if (notifications == "0") return res.status(200).send("No notifications");
      res.status(200).send(notifications.toString());
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async checkSolverLength(req, res, next) {
    try {
      const email = req.user.email;
      const { chatRoom } = req.params;
      const chatLength = await ChatServices.getChatLength(chatRoom);
      if (chatLength.error) return res.status(404).send(chatLength.data);
      const user = await UserServices.findOneByEmail(email);
      if (user.error) return res.status(404).send(user.data);
      const solverLength = user.data.solverMessages.find(
        (chat) => chat.chatRoom === chatRoom
      ).chatLength;
      const notifications = chatLength.data - solverLength;
      if (notifications == "0") return res.status(200).send("No notifications");
      res.status(200).send(notifications.toString());
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async issuerInbox(req, res, next) {
    try {
      const email = req.user.email;
      const user = await UserServices.findOneByEmail(email);
      if (user.error) return res.status(200).send(user.data);
      const issuerChats = await ChatServices.getIssuerChats(user.data._id);
      if (issuerChats.error) return res.status(200).send(issuerChats.data);
      const issuerNotifications = await Promise.all(
        issuerChats.data.map(async (chat) => {
          const found = await user.data.issuerMessages.find((el) => {
            return el.chatId === chat.id.toString();
          });

          if (found) {
            const notifications = chat.allMessages.length - found.chatLength;
            const obj = {
              sender: chat.solver,
              senderPic: chat.solverPic,
              lastMessage: chat.lastMessage,
              date: chat.date,
              report: chat.room,
              notifications: notifications,
            };
            return obj;
          }
        })
      );

      const filteredIssuerNotifications = issuerNotifications.filter(
        (chat) => chat !== undefined && chat.notifications !== 0
      );

      if (filteredIssuerNotifications.length === 0)
        return res.status(200).send("No notifications");

      const allNotifications = filteredIssuerNotifications.reduce(
        (acc, chat) => (acc += chat.notifications),
        0
      );

      const obj = {
        notifications: filteredIssuerNotifications,
        total: allNotifications,
      };
     
      res.status(200).send(obj);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  static async solverInbox(req, res, next) {
    try {
      const email = req.user.email;
      const user = await UserServices.findOneByEmail(email);
      if (user.error) return res.status(404).send(user.data);
      const solverChats = await ChatServices.getSolverChats(user.data._id);

      if (solverChats.error) return res.status(200).send(solverChats.data);
      const solverNotifications = await Promise.all(
        solverChats.data.map(async (chat) => {
          const found = await user.data.solverMessages.find((el) => {
            return el.chatId === chat.id.toString();
          });

          if (found) {
            const notifications = chat.allMessages.length - found.chatLength;
            const obj = {
              sender: chat.issuer,
              senderPic: chat.issuerPic,
              lastMessage: chat.lastMessage,
              date: chat.date,
              report: chat.room,
              notifications: notifications,
            };
            return obj;
          }
        })
      );
      const filteredSolverNotifications = solverNotifications.filter(
        (chat) => chat !== undefined && chat.notifications !== 0
      );

      if (filteredSolverNotifications.length === 0)
        return res.status(200).send("No notifications");

      const allNotifications = filteredSolverNotifications.reduce(
        (acc, chat) => (acc += chat.notifications),
        0
      );

      const obj = {
        notifications: filteredSolverNotifications,
        total: allNotifications,
      };
      console.log(obj)
      res.status(200).send(obj);
    } catch (error) {
      res.status(404).send(error);
    }
  }
}

module.exports = ChatsController;
