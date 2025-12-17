const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.js");
const moment = require("moment-timezone");
const sequelize = new Sequelize("sos_elivator", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Define the User model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically increment the ID
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user", // Default role value
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
    fcm_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    //timestamp: {
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
    otp_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_created_at: {
      type: DataTypes.DATE,
      allowNull: true, // store when OTP was generated
    },
    elevators: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("elevators");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("elevators", JSON.stringify(value));
      },
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

module.exports = { sequelize, User };
