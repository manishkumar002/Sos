const { Sequelize, DataTypes } = require("sequelize");

const config = require("../config/config.js");
const moment = require("moment-timezone");
const sequelize = new Sequelize("sos_elivator", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Define the Technician model
const Technician = sequelize.define(
  "Technician",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increment the ID
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    techunique_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
    // timestamp: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: () => {
    //     return moment().tz("Asia/Kolkata").toDate();
    //   },
    // },
     timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW  
  },

    // Virtual field for 'location'
    location: {
      type: DataTypes.VIRTUAL,
      get() {
        const city = this.getDataValue("city");
        const state = this.getDataValue("state");
        return `${city}, ${state}`;
      },
      set(value) {
        throw new Error(
          "Location cannot be manually set. It is automatically generated from city and state."
        );
      },
    },
  },
  {
    // Additional model options
    timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
    underscored: true, // Use snake_case for column names (e.g., call_recording_status)
  }
);

// Sync the model with the database
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

module.exports = { sequelize, Technician };
