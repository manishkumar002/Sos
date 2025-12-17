const { Sequelize, DataTypes } = require("sequelize");
const moment = require("moment-timezone"); // ✅ Fix: required

const sequelize = new Sequelize("sos_elivator", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const TaskAssigned = sequelize.define(
  "UserDeviceToken",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    elevator_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    technician_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // assigned_date: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: () => {
    //     return moment().tz("Asia/Kolkata").toDate();
    //   },
    // },
     assigned_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW  
  },
  },
  {
    tableName: "task_assigned",
    timestamps: false,
  }
);

sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

const { Technician } = require("./technician");
TaskAssigned.belongsTo(Technician, {
  foreignKey: "technician_id",
  targetKey: "techunique_id",
  as: "technician",
});

module.exports = { sequelize, TaskAssigned };
