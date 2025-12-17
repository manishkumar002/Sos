const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.js");

const sequelize = new Sequelize("sos_elivator", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
// Define the CallList model
const Notes = sequelize.define(
  "Notes",
  {
    // Define the fields according to the provided schema
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increment the ID
    },
    call_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Call ID cannot be null
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: false, // Note
    },

    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically sets the current timestamp
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

module.exports = { sequelize, Notes };
