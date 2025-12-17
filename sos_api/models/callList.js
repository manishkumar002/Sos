const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.js");

const sequelize = new Sequelize("sos_elivator", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
// Define the CallList model
const CallList = sequelize.define(
  "CallList",
  {
    // Define the fields according to the provided schema
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increment the ID
    },
    lift_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Lift ID cannot be null
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Agent ID cannot be null
    },
    call_status: {
      type: DataTypes.STRING(255),
      allowNull: true, // Call status cannot be null
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true, // Address cannot be null
    },
    call_recording_status: {
      type: DataTypes.STRING(255),
      allowNull: true, // Call recording status cannot be null
    },
    timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW  
  },
    call_recording_path: {
      type: DataTypes.STRING(255),
      allowNull: true, // Recording path cannot be null
    },
    agora_channel: {
      type: DataTypes.STRING,
      allowNull: false, // ✅ Important
    },
    recording_sid: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ Important
    },
    recording_resource_id: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ Important
    },
  },
  {
    // Additional model options

    timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
    underscored: true, // Use snake_case for column names (e.g., call_recording_status)
  }
);

// Export the CallList model to use it in the controller
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

// Import and associate User model
const { User } = require("./index");

CallList.belongsTo(User, {
  foreignKey: "agent_id",
  targetKey: "unique_id",
  as: "agent",
});

const { Elevator } = require("./elevator.js");

CallList.belongsTo(Elevator, {
  foreignKey: "lift_id", //CallList table me
  targetKey: "elevatorid", //Elevator table me
  as: "elevator",
});

module.exports = { sequelize, CallList };
