// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const authRoutes = require("./routes/auth/index.js");
// const { sequelize } = require("./models/index.js");
// const callListRoutes = require("./routes/callList/index.js");
// const noteRoutes = require("./routes/notes/index.js");
// const technicianRoutes = require("./routes/technician/index.js"); // Import technician routes
// const agentRoutes = require("./routes/agent/index.js"); // Import agent routes
// const elevatorRoutes = require("./routes/elevator/index.js"); // Import elevator routes

// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(bodyParser.json());

// app.use("/api/", authRoutes);
// app.use("/api", callListRoutes);
// app.use("/api", noteRoutes);
// app.use("/api", technicianRoutes); // Register technician routes
// app.use("/api", agentRoutes); // Register agent routes
// app.use("/api", elevatorRoutes); // Register agent routes

// // Sync database and start server
// sequelize
//   .sync()
//   .then(() => console.log("Database synced"))
//   .catch((err) => console.error("Error syncing database:", err));

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// -------------------------------------------------------------------lest mode -------------------

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const { sequelize } = require("./models/index.js");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth/index.js");
const callListRoutes = require("./routes/callList/index.js");
const noteRoutes = require("./routes/notes/index.js");
const technicianRoutes = require("./routes/technician/index.js");
const agentRoutes = require("./routes/agent/index.js");
const elevatorRoutes = require("./routes/elevator/index.js");
const assignedRoutes = require("./routes/assigned/index.js");

const app = express();
const server = http.createServer(app);

// Create socket.io and attach it to app
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.set("socketio", io); // Make IO accessible in APIs

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/", authRoutes);
app.use("/api", callListRoutes);
app.use("/api", noteRoutes);
app.use("/api", technicianRoutes);
app.use("/api", agentRoutes);
app.use("/api", elevatorRoutes);
app.use("/api", assignedRoutes);
// Agent Socket Store: agentId => socketId
const connectedAgents = {};
global.connectedAgents = connectedAgents;

// Handle socket connections
io.on("connection", (socket) => {
  console.log("Agent connected:", socket.id);

  // Register agent with ID
  socket.on("register-agent", (agentId) => {
    if (agentId) {
      connectedAgents[agentId] = socket.id;
      console.log(`Agent registered: ${agentId} => ${socket.id}`);
    }
  });

  // Trigger incoming call
  socket.on("call-agents", (data) => {
    console.log("Calling agents:", data);
    for (const socketId of Object.values(connectedAgents)) {
      io.to(socketId).emit("incoming-call", data);
    }
  });

  // Handle call end event
  socket.on("call-ended", ({ agentId }) => {
    const targetSocketId = connectedAgents[agentId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("stop-notification");
      console.log(`Call ended for agent ${agentId}`);
    }
  });

  // Remove agent on disconnect
  socket.on("disconnect", () => {
    console.log("Agent disconnected:", socket.id);
    for (const [agentId, sockId] of Object.entries(connectedAgents)) {
      if (sockId === socket.id) {
        delete connectedAgents[agentId];
        console.log(`Agent unregistered: ${agentId}`);
        break;
      }
    }
  });
});

// Sync DB
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("DB Sync Error:", err));

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
