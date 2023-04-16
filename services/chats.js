const { Chat, Message, User, Report } = require("../models");

class ChatServices {
  static async createNewChat(room) {
    try {
      const existingChat = await Chat.findOne({ room });
      if (existingChat) {
        return { error: false, data: existingChat };
      }
      const newChat = await Chat.create({ room });
      return { error: false, data: newChat };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async addMessages(msg, room, userId) {
    try {
      const chatRoom = await Chat.findOne({ room });
      if (!chatRoom) {
        return { error: true, data: "Chat does not exist" };
      }
      const newMessage = await Message.create({ user: userId, content: msg });
      if (!newMessage) {
        return { error: true, data: "Message cannot be created" };
      }
      chatRoom.allMessages.push(newMessage._id);
      chatRoom.save();
      const populatedMessage = await newMessage.populate("user");
      return { error: false, data: populatedMessage };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async getChatHistory(chatId) {
    try {
      const chat = await Chat.findById(chatId);
      if (chat.allMessages.length === 0) {
        return { error: false, data: "No Chat History" };
      }
      const chatWithMessages = await chat.populate({
        path: "allMessages",
        populate: {
          path: "user",
        },
      });
      return { error: false, data: chatWithMessages };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async getChatLength(chatRoom) {
    try {
      const chat = await Chat.find({ room: chatRoom });
      if (chat[0].allMessages?.length === 0) {
        return { error: false, data: "No Chat History" };
      }
      const chatLength = chat[0].allMessages.length;
      return { error: false, data: chatLength };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async recordIssuerLength(email, chatLength, chatId, chatRoom) {
    try {
      const userWithChat = await User.findOne({
        email: email,
        "issuerMessages.chatId": chatId,
      });

      if (!userWithChat) {
        const issuer = await User.findOne({ email });
        issuer.issuerMessages?.push({
          chatId: chatId,
          chatLength: chatLength,
          chatRoom: chatRoom,
        });
        issuer.save();
        const report = await Report.findById(chatRoom).populate("solver");
        const solver = report.solver;
        solver.solverMessages?.push({
          chatId: chatId,
          chatLength: chatLength,
          chatRoom: chatRoom,
        });
        solver.save();
        return { error: false, data: issuer };
      } else {
        userWithChat.issuerMessages.map((chat) => {
          if (chat.chatId === chatId) {
            chat.chatLength = chatLength;
          }
        });
        userWithChat.save();
        return { error: false, data: userWithChat };
      }
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async recordSolverLength(email, chatLength, chatId, chatRoom) {
    try {
      const userWithChat = await User.findOne({
        email: email,
        "solverMessages.chatId": chatId,
      });

      if (!userWithChat) {
        const solver = await User.findOne({ email });
        solver.solverMessages?.push({
          chatId: chatId,
          chatLength: chatLength,
          chatRoom: chatRoom,
        });
        solver.save();

        const report = await Report.findById(chatRoom).populate("issuer");
        const issuer = report.issuer;
        issuer.issuerMessages?.push({
          chatId: chatId,
          chatLength: chatLength,
          chatRoom: chatRoom,
        });
        issuer.save();

        return { error: false, data: solver };
      } else {
        userWithChat.solverMessages.map((chat) => {
          if (chat.chatId === chatId) {
            chat.chatLength = chatLength;
          }
        });
        userWithChat.save();
        return { error: false, data: userWithChat };
      }
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async getIssuerChats(issuerId) {
    try {
      const issuerReports = await Report.find({ issuer: issuerId }).populate([
        "solver",
        "issuer",
      ]);
      if (issuerReports.length === 0)
        return { error: true, data: "No reports" };
      const chats = await Promise.all(
        issuerReports.map(async (report) => {
          const chat = await Chat.findOne({ room: report._id });

          if (chat && chat.allMessages.length !== 0) {
            const lastMessageId =
              chat.allMessages[Number(chat.allMessages.length) - 1].toString();
            const lastMessage = await Message.findOne({ _id: lastMessageId });
            return {
              id: chat._id,
              room: chat.room,
              allMessages: chat.allMessages,
              date: lastMessage?.date,
              lastMessage: lastMessage?.content,
              solver: report.solver.name,
              solverPic: report.solver.picture || "no pic",
              issuer: report.issuer.name,
            };
          }
        })
      );

      const issuerChats = chats.filter((chat) => chat !== undefined);
      if (issuerChats.length === 0) return { error: true, data: "No chats" };
      return { error: false, data: issuerChats };
    } catch (error) {
      return { error: true, data: error };
    }
  }

  static async getSolverChats(solverId) {
    try {
      const solverReports = await Report.find({ solver: solverId }).populate([
        "solver",
        "issuer",
      ]);
      if (solverReports.length === 0)
        return { error: true, data: "No reports" };
      const chats = await Promise.all(
        solverReports.map(async (report) => {
          const chat = await Chat.findOne({ room: report._id });
          if (chat && chat.allMessages.length !== 0) {
            const lastMessageId =
              chat.allMessages[Number(chat.allMessages.length) - 1].toString();
            const lastMessage = await Message.findOne({ _id: lastMessageId });
            return {
              id: chat._id,
              room: chat.room,
              allMessages: chat.allMessages,
              date: lastMessage?.date,
              lastMessage: lastMessage?.content,
              solver: report.solver.name,
              issuer: report.issuer.name,
              issuerPic: report.solver.picture || "no pic",
            };
          }
        })
      );
      const solverChats = chats.filter((chat) => chat !== undefined);
      if (solverChats.length === 0) return { error: true, data: "No chats" };
      return { error: false, data: solverChats };
    } catch (error) {
      return { error: true, data: error };
    }
  }
}

module.exports = ChatServices;
