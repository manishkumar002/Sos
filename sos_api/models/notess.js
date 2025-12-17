const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js');
const moment = require('moment-timezone'); 
const sequelize = new Sequelize("sos_elivator", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Define the CallList model
const Notess = sequelize.define('Notess', {
  // Define the fields according to the provided schema
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Automatically increment the ID
  },
  call_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: "", // Call ID cannot be null
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: "", // Call ID cannot be null
  },
  notes: {
    type: DataTypes.STRING(255),
    allowNull: false, // Note
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Starr'
  },
  
  // timestamp: {
  //    type: DataTypes.DATE,
  //    allowNull: false,
  //    defaultValue: () => {
  //      return moment().tz('Asia/Kolkata').toDate(); 
  //    }
  //  }
   timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW  
  }
}, {
  // Additional model options
  
  timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
  tableName: 'notess',
});


// Export the CallList model to use it in the controller
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Error syncing database:', err));



const { CallList } = require('./callList.js');

Notess.belongsTo(CallList, {
  foreignKey: 'call_id',
  targetKey: 'id',
  as: 'agent'
});

const { User } = require('./index.js');

CallList.belongsTo(User, {
  foreignKey: 'agent_id',
  targetKey: 'unique_id',
  as: 'agentList'
});



module.exports = { sequelize, Notess };