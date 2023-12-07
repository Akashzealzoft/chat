const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../config/database"); // You need to have a Sequelize instance configured

const Message = sequelize.define(
  "messages",
  {
    ID: {
      type: DataTypes.INTEGER,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    recieverId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Synchronize the model with the database
//Message.sync({ force: true });

sequelize
  .sync()
  .then(() => console.log(" chatTable created"))
  .catch((error) => console.log(error));

// Export the model for use in other parts of your application
module.exports = Message;
