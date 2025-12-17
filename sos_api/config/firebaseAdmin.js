// var admin = require("firebase-admin");
// var serviceAccount = require("../config/serviceAccountKey.json"); // Correct path!

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://notificationtest-3f40a-default-rtdb.europe-west1.firebasedatabase.app"
// });

// module.exports = admin;



var admin = require("firebase-admin");
 
var serviceAccount = require("../config/serviceAccountKey.json");
 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;