require("dotenv").config();

module.exports = {
  development: {
    username: "admin",
    password: "password",
    database: "sos_elivator",
    host: "localhost",
    dialect: "mysql",
  },
  // Other environments
};

// config.js
// module.exports = {
//   database: 'sos_elivator',
//   username: 'root', // Your MySQL username
//   password: 'Root@123',     // Your MySQL password
//   host: '127.0.0.1',
//   dialect: 'mysql'
// };
