const Message = require("../models/chatmodel");
const Sequelize = require("sequelize");

exports.getAllChats = async (req, res) => {
  try {
    const { senderIdToMatch, receiverIdToMatch } = req.body;
    // Using await to asynchronously retrieve all values from the "messages" table
    const messages = await Message.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            [Sequelize.Op.and]: [
              { senderId: senderIdToMatch },
              { recieverId: receiverIdToMatch },
            ],
          },
          {
            [Sequelize.Op.and]: [
              { senderId: receiverIdToMatch }, // Note the swap of senderId and receiverId
              { recieverId: senderIdToMatch },
            ],
          },
        ],
      },
    });

    // Sending a success response with a status code of 200 and the retrieved messages
    res.status(200).json(messages);
  } catch (error) {
    // Handling errors and sending a response with a status code of 500 and an error message
    console.error("Error retrieving values:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createMessage = async (req, res) => {
  const { text, username } = req.body;
  try {
    const newMessage = await Message.create({ text, username });

    res.status(201).json({
      text: newMessage.text,
      username: newMessage.username,
      created_at: newMessage.created_at,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*Socket DB messages */

exports.getSocketMessages = async (msg) => {
  try {
    // Using Sequelize's findAll method to retrieve the last 10 messages
    console.log(msg);
    const { senderId, recieverId } = msg;
    console.log(senderId, recieverId);
    const messages = await await Message.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            [Sequelize.Op.and]: [
              { senderId: senderId },
              { recieverId: recieverId },
            ],
          },
          {
            [Sequelize.Op.and]: [
              { senderId: recieverId }, // Note the swap of senderId and receiverId
              { recieverId: senderId },
            ],
          },
        ],
      },
    });

    // Returning the retrieved messages
    return messages;
  } catch (error) {
    // Handling errors, you might want to log or handle the error accordingly
    console.error("Error retrieving messages:", error);
    throw error; // Rethrow the error to be handled elsewhere if needed
  }
};

exports.createSocketMessage = async (message) => {
  try {
    console.log(message);
    console.log(typeof message);
    console.log(Object.keys(message));
    console.log("im the message", message["text"]);
    // Using Sequelize's create method to insert a new message
    const newMessage = await Message.create({
      senderId: message["senderId"],
      recieverId: message["recieverId"],
      text: message["text"],
      username: message["username"],
    });
    // const newMessage = await Message.create({
    //   text: message.text,
    //   username: message.username,
    // });

    // Returning the newly created message
    return {
      text: newMessage.text,
      username: newMessage.username,
      created_at: newMessage.created_at,
    };
  } catch (error) {
    // Handling errors, you might want to log or handle the error accordingly
    console.error("Error creating message:", error);
    throw error; // Rethrow the error to be handled elsewhere if needed
  }
};
