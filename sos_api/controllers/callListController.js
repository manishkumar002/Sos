// controllers/callListController.js
const { CallList } = require("../models/callList");
const { User } = require("../models/index");
const { Elevator } = require("../models/elevator");
//const { Agent } = require("../models/agent");

const generateAgoraToken = require("../utils/agoraToken");
// Get all call lists
// exports.getAllCallLists = async (req, res) => {
//   try {
//     const callLists = await CallList.findAll();
//     res.json({ callLists });
//   } catch (error) {
//     console.error('Error fetching call lists:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

exports.getAllCallLists = async (req, res) => {
  try {
    const { agentId, elevatorId, startDate, endDate } = req.body;

    let whereCondition = {};

    if (agentId) {
      whereCondition.agent_id = agentId;
    }

    if (elevatorId) {
      whereCondition.lift_id = elevatorId;
    }

    if (startDate && endDate) {
      whereCondition.timestamp = {
        [Op.between]: [
          new Date(startDate),
          new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        ],
      };
    }

    const callLists = await CallList.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "agent",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Elevator,
          as: "elevator",
          attributes: ["elevatorid", "user", "company"],
        },
      ],
    });

    res.json({ callLists });
  } catch (error) {
    console.error("Error fetching call lists with user and elevator:", error);
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

// exports.getAllCallLists = async (req, res) => {
//   try {
//     const callLists = await CallList.findAll({
//       include: [
//         {
//           model: User,
//           as: 'agent',
//           attributes: ['id', 'name', 'email', 'phone'],
//         },
//         {
//           model: Elevator,
//           as: 'elevator',
//           attributes: ['elevatorid', 'user', 'company'],
//         },
//       ],
//     });

//     res.json({ callLists });
//   } catch (error) {
//     console.error('Error fetching call lists with user and elevator:', error);
//     res.status(500).json({ message: `Internal server error: ${error}` });
//   }
// };

// Get all call lists
exports.getSosCallInfo = async (req, res) => {
  try {
    const callLists = await CallList.findAll();
    res.json({ callLists });
  } catch (error) {
    console.error("Error fetching call lists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific call list by ID
exports.getCallListById = async (req, res) => {
  const { id } = req.params;
  try {
    const callList = await CallList.findByPk(id);
    if (!callList) {
      return res.status(404).json({ message: "Call List not found" });
    }
    res.json({ callList });
  } catch (error) {
    console.error("Error fetching call list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new call list

// exports.createCallList = async (req, res) => {
//   const { lift_id, agent_id, call_status, address, call_recording_status, timestamp, call_recording_path } = req.body;

//   try {
//     const newCallList = await CallList.create({
//       lift_id,
//       agent_id,
//       call_status,
//       address,
//       call_recording_status,
//       timestamp: timestamp || new Date(),
//       call_recording_path,
//     });
//     res.status(201).json({ message: 'Call List created successfully', newCallList });
//   } catch (error) {
//     console.error('Error creating call list:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// Update a call list by ID
exports.updateCallList = async (req, res) => {
  const { id } = req.params;

  const {
    lift_id,
    agent_id,
    call_status,
    address,
    call_recording_status,
    timestamp,
    call_recording_path,
  } = req.body;

  try {
    const callList = await CallList.findByPk(id);
    if (!callList) {
      return res.status(404).json({ message: "Call List not found" });
    }

    // Update the fields
    if (lift_id) callList.lift_id = lift_id;
    if (agent_id) callList.agent_id = agent_id;
    if (call_status) callList.call_status = call_status;
    if (address) callList.address = address;
    if (call_recording_status)
      callList.call_recording_status = call_recording_status;
    if (timestamp) callList.timestamp = timestamp;
    if (call_recording_path) callList.call_recording_path = call_recording_path;

    await callList.save();
    res.json({ message: "Call List updated successfully", callList });
  } catch (error) {
    console.error("Error updating call list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a call list by ID
exports.deleteCallList = async (req, res) => {
  const { id } = req.params;
  try {
    const callList = await CallList.findByPk(id);
    if (!callList) {
      return res.status(404).json({ message: "Call List not found" });
    }

    await callList.destroy();
    res.json({ message: "Call List deleted successfully" });
  } catch (error) {
    console.error("Error deleting call list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Join call status and validate call_id
exports.joinCallStatus = async (req, res) => {
  const { call_id } = req.body; // Assuming call_id is sent in the request body

  try {
    // Check if the provided call_id exists in the database
    const callList = await CallList.findByPk(call_id);

    if (callList) {
      // If the call_id exists, return true
      res.json({ success: true });
    } else {
      // If the call_id does not exist, return false
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error checking call_id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Request call recording by call_id
// Request call recording by call_id
exports.requestCallRecording = async (req, res) => {
  const { call_id } = req.body; // Get the call_id from the request body

  try {
    // Check if the provided call_id exists in the database
    const callList = await CallList.findByPk(call_id);

    if (callList) {
      // If the call_id exists, determine if the call recording is available
      const response = {
        status: "success",
        message: "Call details retrieved successfully",
        content: {
          id: callList.id, // Return the unique call ID
          callRecordingStatus: callList.call_recording_path
            ? "available"
            : "unavailable", // Check if the call recording is available
          callRecording: callList.call_recording_path || "", // Return the call recording URL or file path
        },
      };

      res.json(response); // Send the response
    } else {
      // If the call_id doesn't exist, return an error message
      res.status(404).json({
        status: "error",
        message: "Call ID not found",
        content: {},
      });
    }
  } catch (error) {
    console.error("Error checking call recording:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      content: {},
    });
  }
};

exports.getSpashScreenInfo = async (req, res) => {
  try {
    // Static response with your specified data
    const response = {
      Status: "success",
      agora_Server_active: true,
      api_server_active: true,
    };

    res.json(response); // Send the static response
  } catch (error) {
    console.error("Error in static response:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      content: {},
    });
  }
};

exports.getStartCallInfo = async (req, res) => {
  try {
    // Static response with your specified data
    const response = {
      Status: true,
    };

    res.json(response); // Send the static response
  } catch (error) {
    console.error("Error in static response:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      content: {},
    });
  }
};

exports.checkCallStatus = async (req, res) => {
  try {
    // Static response with your specified data
    const response = {
      Status: "success",
      channel_name: "channel1",
      Agora_Token: "eeeqaerfkotpt6688",
    };

    res.json(response); // Send the static response
  } catch (error) {
    console.error("Error in static response:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      content: {},
    });
  }
};

const admin = require("../config/firebaseAdmin"); // Firebase Admin SDK
const { Op, literal } = require("sequelize");
// exports.createCallList = async (req, res) => {
//   const { lift_id } = req.body;

//   try {
//     console.log("Create call request received:", lift_id);

//     const lift = await Elevator.findOne({ where: { elevatorid: lift_id } });
//     if (!lift) {
//       return res.status(404).json({ message: "Elevator not found" });
//     }

//     const agora_channel = `lift_${lift_id}_${Date.now()}`;
//     const fullAddress = `${lift.city}, ${lift.state}, ${lift.zip}`;
//     const timestamp = new Date();

//     // Create new call entry in the database
//     const newCall = await CallList.create({
//       lift_id,
//       agent_id: null,
//       call_status: "Waiting",
//       address: fullAddress,
//       timestamp,
//       agora_channel,
//     });

//     // Set timeout to mark call as missed if not answered
//     setTimeout(async () => {
//       try {
//         const checkCall = await CallList.findByPk(newCall.id);
//         if (checkCall && checkCall.call_status === "Waiting") {
//           checkCall.call_status = "Missed";
//           await checkCall.save();
//           console.log(`Call ID ${newCall.id} marked as missed`);
//         }
//       } catch (err) {
//         console.error("Error checking for missed call:", err.message);
//       }
//     }, 60000); // 60 seconds timeout

//     const liftToken = generateAgoraToken(agora_channel, 1, 1);
//     console.log("Call created successfully:", newCall.id);
//     console.log("Agora Token:", liftToken);

//     // Socket IO Notification
//     const io = req.app.get("socketio");
//     const connectedAgents = global.connectedAgents || {};

//     if (!io) {
//       console.error("[Socket] IO instance is missing!");
//     } else {
//       Object.entries(connectedAgents).forEach(([agentId, socketId]) => {
//         io.to(socketId).emit("incoming-call", {
//           id: newCall.id,
//           lift_id,
//           address: fullAddress,
//           agora_channel,
//           timestamp,
//         });
//       });
//       console.log("Notification sent to logged-in agents (Socket)");
//     }

//     // FCM Notification
//     const usersWithToken = await User.findAll({
//       where: {
//         fcm_token: { [Op.ne]: null }, // Only users with non-null FCM token
//       },
//       attributes: ["id", "fcm_token"],
//     });

//     const fcmTokens = usersWithToken
//       .map((user) => user.fcm_token)
//       .filter((token) => !!token);
//     console.log(fcmTokens, "fcmTokens");

//     if (fcmTokens.length > 0) {
//       const message = {
//         // notification: {
//         //   title: "Incoming Call!",
//         //   body: "We have a new call.",
//         // },
//         data: {
//           call_id: `${newCall.id}`,
//           lift_id: `${lift_id}`,
//           agora_channel: agora_channel,
//           timestamp: timestamp.toISOString(),
//           token: `${liftToken}`,
//           agora_id: "1",
//           audio_ul: "",
//           address: fullAddress,
//           type: "incoming_call",
//         },
//       };

//       try {
//         // Use sendMulticast to send notifications to multiple devices
//         const response = await admin.messaging().sendEachForMulticast({
//           tokens: fcmTokens, // Pass an array of tokens
//           notification: message.notification,
//           data: message.data,
//         });

//         // Log the response to check success/failure
//         console.log(
//           `✅ Notifications sent: ${response.successCount}, Failed: ${response.failureCount}`
//         );

//         // Handle failed notifications
//         if (response.failureCount > 0) {
//           response.responses.forEach((resp, idx) => {
//             if (!resp.success) {
//               console.error(`Error for token ${fcmTokens[idx]}:`, resp.error);
//             }
//           });
//         }
//       } catch (err) {
//         console.error("Error sending FCM notifications:", err.message);
//       }
//     } else {
//       console.log("No FCM tokens found for users.");
//     }

//     return res.status(201).json({
//       message: "Call created",
//       data: {
//         call_id: newCall.id,
//         agora_channel,
//         token: liftToken,
//         uid: 1,
//         audio_ul: "",
//         address: fullAddress,
//         type: "incoming_call",
//       },
//     });
//   } catch (error) {
//     console.error("[API ERROR]", error.stack || error.message);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// const {
//   acquireResource,
//   startRecording,
// } = require("../utils/agoraRecordingService");

// exports.receiveCall = async (req, res) => {
//   const { call_id, agent_id } = req.body;

//   try {
//     const call = await CallList.findOne({ where: { id: call_id } });
//     if (!call) return res.status(404).json({ message: "Call not found" });
//     if (call.agent_id)
//       return res.status(400).json({ message: "Already received" });

//     const agora_channel = call.agora_channel;
//     const agent_uid = 2;
//     const recording_uid = 999;

//     const agentToken = generateAgoraToken(agora_channel, agent_uid, 2);

//     // ✅ Acquire & Start Recording
//     const resourceId = await acquireResource(agora_channel, recording_uid);
//     const startRes = await startRecording(
//       resourceId,
//       agora_channel,
//       recording_uid
//     );

//     call.agent_id = agent_id;
//     call.call_status = "active";
//     call.recording_sid = startRes.sid;
//     call.recording_resource_id = resourceId;
//     await call.save();

//     return res.status(200).json({
//       message: "Call accepted and recording started",
//       data: {
//         agora_channel,
//         token: agentToken,
//         uid: agent_uid,
//         recording: startRes,
//       },
//     });
//   } catch (error) {
//     console.error("Error in receiveCall:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// const { stopRecording } = require("../utils/agoraRecordingService");

// exports.endCall = async (req, res) => {
//   const { call_id } = req.body;

//   try {
//     const call = await CallList.findByPk(call_id);
//     if (!call || call.call_status === "finished") {
//       return res
//         .status(400)
//         .json({ message: "Invalid or already finished call" });
//     }

//     const { recording_resource_id, recording_sid, agora_channel } = call;
//     const recording_uid = 999;

//     if (recording_resource_id && recording_sid) {
//       await new Promise((resolve) => setTimeout(resolve, 3000));

//       try {
//         const stopResponse = await stopRecording(
//           recording_resource_id,
//           recording_sid,
//           agora_channel,
//           recording_uid
//         );

//         console.log("Recording stopped:", stopResponse);

//         if (stopResponse?.serverResponse?.fileList) {
//           call.call_recording_path = JSON.stringify(
//             stopResponse.serverResponse.fileList
//           );
//         }
//       } catch (err) {
//         const errData = err.response?.data || err.message;
//         if (
//           errData.code === 404 &&
//           errData.reason === "failed to find worker"
//         ) {
//           console.warn("Worker already stopped. Proceeding.");
//         } else {
//           console.error("Failed to stop recording:", errData);
//         }
//       }
//     }

//     call.call_status = "finished";
//     await call.save();

//     return res.status(200).json({ message: "Call ended successfully" });
//   } catch (error) {
//     console.error("Error in endCall:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// ... (your existing createCallList code)
const { RtcRole } = require("agora-access-token");
const {
  acquireResource,
  startRecording,
  stopRecording,
} = require("../utils/agoraRecordingService");

exports.createCallList = async (req, res) => {
  const { lift_id } = req.body;
  console.log(
    `[CallController] Create call request received for lift_id: ${lift_id}`
  );

  try {
    // 1. Elevator
    const lift = await Elevator.findOne({ where: { elevatorid: lift_id } });
    if (!lift) {
      console.warn(`[CallController] Elevator with ID ${lift_id} not found.`);
      return res.status(404).json({ message: "Elevator not found" });
    }

    // 2. Call details
    const agora_channel = `lift_${lift_id}_${Date.now()}`;
    const fullAddress = `${lift.city}, ${lift.state}, ${lift.zip}`;
    const timestamp = new Date();

    // 3. Call DB save
    const newCall = await CallList.create({
      lift_id,
      agent_id: null,
      call_status: "Waiting",
      address: fullAddress,
      timestamp,
      agora_channel,
    });

    console.log(
      `[CallController] New call created with ID: ${newCall.id}, Channel: ${agora_channel}`
    );

    // 4. call missed update
    setTimeout(async () => {
      try {
        const checkCall = await CallList.findByPk(newCall.id);
        if (checkCall && checkCall.call_status === "Waiting") {
          checkCall.call_status = "Missed";
          await checkCall.save();
          console.log(
            `[CallController] Call ID ${newCall.id} marked as 'Missed'.`
          );
        }
      } catch (err) {
        console.error(
          `[CallController] Error checking call status:`,
          err.message
        );
      }
    }, 60000);

    // 5. Agora token
    const lift_uid = 1;
    const liftToken = generateAgoraToken(
      agora_channel,
      lift_uid,
      RtcRole.PUBLISHER
    );

    // 6. agents  lift assign (JSON_CONTAINS)
    const assignedAgents = await User.findAll({
      where: {
        role: "agent",
        elevators: literal(`JSON_CONTAINS(elevators, '"${lift_id}"')`),
      },
      attributes: ["id", "fcm_token"],
    });

    // 7. ✅ Socket.IO  online assigned agents message
    const io = req.app.get("socketio");
    const connectedAgents = global.connectedAgents || {};

    if (!io) {
      console.error("[CallController] Socket.IO");
    } else {
      assignedAgents.forEach((agent) => {
        const socketId = connectedAgents[agent.id];
        if (socketId) {
          io.to(socketId).emit("incoming-call", {
            id: newCall.id,
            lift_id,
            address: fullAddress,
            agora_channel,
            timestamp,
          });
          console.log(`[CallController] Incoming call agent ${agent.id}`);
        } else {
          console.log(`[CallController] Agent ${agent.id} Socket`);
        }
      });
    }

    // 8. agents FCM fcm_token
    const fcmTokens = assignedAgents
      .map((agent) => agent.fcm_token)
      .filter((token) => !!token);

    if (fcmTokens.length > 0) {
      const message = {
        data: {
          call_id: `${newCall.id}`,
          lift_id: `${lift_id}`,
          agora_channel,
          timestamp: timestamp.toISOString(),
          token: `${liftToken}`,
          agora_id: `${lift_uid}`,
          audio_ul: "",
          address: fullAddress,
          type: "incoming_call",
        },
      };

      try {
        const response = await admin.messaging().sendEachForMulticast({
          tokens: fcmTokens,
          data: message.data,
        });
        console.log(
          `[CallController] FCM Success: ${response.successCount}, Failed: ${response.failureCount}`
        );
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error(
              `[CallController] FCM Error (Token: ${fcmTokens[idx]}):`,
              resp.error
            );
          }
        });
      } catch (err) {
        console.error("[CallController] FCM Error:", err.message);
      }
    } else {
      console.log("[CallController]  FCM token assigned agents");
    }

    // 9. Response client
    return res.status(201).json({
      message: "Call created",
      data: {
        call_id: newCall.id,
        agora_channel,
        token: liftToken,
        uid: lift_uid,
        audio_ul: "",
        address: fullAddress,
        type: "incoming_call",
      },
    });
  } catch (error) {
    console.error("[CallController] Error:", error.stack || error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// --- Controller for an agent receiving (accepting) a call ---
exports.receiveCall = async (req, res) => {
  const { call_id, agent_id } = req.body;
  console.log(
    `[CallController] Receive call request for call_id: ${call_id}, agent_id: ${agent_id}`
  );

  try {
    const call = await CallList.findOne({ where: { id: call_id } });
    if (!call) {
      console.warn(`[CallController] Call with ID ${call_id} not found.`);
      return res.status(404).json({ message: "Call not found" });
    }
    if (call.agent_id) {
      console.warn(
        `[CallController] Call ID ${call_id} already accepted by agent ${call.agent_id}.`
      );
      return res.status(400).json({ message: "Call already accepted" });
    }

    const agora_channel = call.agora_channel;
    const agent_uid = 2;
    const recording_uid = 999;
    const agentToken = generateAgoraToken(
      agora_channel,
      agent_uid,
      RtcRole.PUBLISHER
    );
    console.log(
      `[CallController] Agora token generated for agent UID ${agent_uid}.`
    );

    let resourceId, startRes;
    try {
      console.log(
        `[CallController] Attempting to acquire recording resource...`
      );
      resourceId = await acquireResource(agora_channel, recording_uid);
      console.log(
        `[CallController] Recording resource acquired: ${resourceId}`
      );
      console.log(`[CallController] Attempting to start recording...`);
      startRes = await startRecording(resourceId, agora_channel, recording_uid);
      console.log(
        `[CallController] Recording started successfully. SID: ${startRes.sid}`
      );
    } catch (recordingError) {
      console.error(
        "[CallController] Failed to start recording during receiveCall:",
        recordingError.response?.data
          ? JSON.stringify(recordingError.response.data, null, 2)
          : recordingError.message
      );
      console.warn(
        "[CallController] Proceeding with call acceptance despite recording start failure."
      );
      resourceId = null;
      startRes = null;
    }

    call.agent_id = agent_id;
    call.call_status = "active";
    if (resourceId && startRes?.sid) {
      call.recording_sid = startRes.sid;
      call.recording_resource_id = resourceId;
      console.log("[CallController] Recording details saved to CallList DB.");
    } else {
      console.warn(
        "[CallController] Recording did not start successfully. No recording SID/resource ID saved."
      );
    }
    await call.save();

    return res.status(200).json({
      message: "Call accepted and recording initiated",
      data: {
        agora_channel,
        token: agentToken,
        uid: agent_uid,
        recording: startRes || null,
      },
    });
  } catch (error) {
    console.error(
      "[CallController] Error in receiveCall:",
      error.stack || error.message
    );
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// --- Controller for ending a call ---
exports.endCall = async (req, res) => {
  const { call_id } = req.body;
  console.log(`[CallController] End call request for call_id: ${call_id}`);

  try {
    const call = await CallList.findByPk(call_id);
    if (!call || call.call_status === "finished") {
      console.warn(
        `[CallController] Invalid or already finished call with ID: ${call_id}.`
      );
      return res
        .status(400)
        .json({ message: "Invalid or already finished call" });
    }

    const { recording_resource_id, recording_sid, agora_channel } = call;
    const recording_uid = 999;
    if (recording_resource_id && recording_sid) {
      try {
        console.log(
          `[CallController] Attempting to stop recording for resourceId: ${recording_resource_id}, SID: ${recording_sid}.`
        );
        const stopResponse = await stopRecording(
          recording_resource_id,
          recording_sid,
          agora_channel,
          recording_uid
        );
        console.log(
          "[CallController] Recording stopped successfully:",
          JSON.stringify(stopResponse, null, 2)
        );

        if (stopResponse?.serverResponse?.fileList) {
          call.call_recording_path = JSON.stringify(
            stopResponse.serverResponse.fileList
          );
          console.log("[CallController] Recording file list saved to DB.");
        } else {
          console.warn(
            "[CallController] No fileList found in stop recording response. Recording might have been empty."
          );
        }
      } catch (err) {
        console.error(
          "[CallController] Error during recording stop:",
          err.response?.data
            ? JSON.stringify(err.response.data, null, 2)
            : err.message
        );
        if (
          err.response?.status === 404 &&
          err.response.data?.reason === "failed to find worker"
        ) {
          console.warn(
            "[CallController] Agora recording worker already stopped or not found. Proceeding with call end."
          );
        } else {
          console.error(
            "[CallController] Critical error when stopping recording:",
            err
          );
        }
      }
    } else {
      console.log(
        "[CallController] No recording details (resourceId/SID) found for this call. Skipping recording stop."
      );
    }

    call.call_status = "finished";
    await call.save();
    console.log(
      `[CallController] Call ID ${call_id} status updated to 'finished'.`
    );
    const io = req.app.get("socketio");
    if (io) {
      io.to(agora_channel).emit("call-ended", {
        call_id: call.id,
        agora_channel,
      });
      console.log(
        `[CallController] Emitted 'call-ended' event for channel: ${agora_channel}.`
      );
    } else {
      console.warn(
        "[CallController] Socket.IO instance not available for emitting call-ended event."
      );
    }

    return res.status(200).json({ message: "Call ended successfully" });
  } catch (error) {
    console.error(
      "[CallController] Error in endCall:",
      error.stack || error.message
    );
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const { fn, col } = require("sequelize");

exports.getMonthlyCallListCountFinished = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01`);

    const monthlyData = await CallList.findAll({
      attributes: [
        [fn("MONTH", col("timestamp")), "month"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        timestamp: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
        call_status: "finished", // <- Added filter here
      },
      group: [fn("MONTH", col("timestamp"))],
      order: [[fn("MONTH", col("timestamp")), "ASC"]],
      raw: true,
    });

    // Month mapping
    const monthNames = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Initialize all months with 0
    const result = [];
    for (let i = 1; i <= 12; i++) {
      result.push({
        month: monthNames[i],
        count: 0,
      });
    }

    // Fill counts from DB data
    monthlyData.forEach((item) => {
      const monthIndex = item.month;
      result[monthIndex - 1].count = item.count;
    });

    res.json({ year, data: result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// graph chart Missed call
exports.getMonthlyCallListCountMissed = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${parseInt(year) + 1}-01-01`);

    const monthlyData = await CallList.findAll({
      attributes: [
        [fn("MONTH", col("timestamp")), "month"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        timestamp: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
        call_status: "missed", // <- Added filter here
      },
      group: [fn("MONTH", col("timestamp"))],
      order: [[fn("MONTH", col("timestamp")), "ASC"]],
      raw: true,
    });

    // Month mapping
    const monthNames = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Initialize all months with 0
    const result = [];
    for (let i = 1; i <= 12; i++) {
      result.push({
        month: monthNames[i],
        count: 0,
      });
    }

    // Fill counts from DB data
    monthlyData.forEach((item) => {
      const monthIndex = item.month;
      result[monthIndex - 1].count = item.count;
    });

    res.json({ year, data: result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// graph chart 7 Days call
const moment = require("moment");

exports.getLast7DaysFinishedCount = async (req, res) => {
  try {
    const today = moment().endOf("day");
    const sevenDaysAgo = moment().subtract(6, "days").startOf("day");

    const dailyData = await CallList.findAll({
      attributes: [
        [fn("DATE", col("timestamp")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        timestamp: {
          [Op.between]: [sevenDaysAgo.toDate(), today.toDate()],
        },
        call_status: "finished",
      },
      group: [fn("DATE", col("timestamp"))],
      order: [[fn("DATE", col("timestamp")), "ASC"]],
      raw: true,
    });

    const result = [];
    let totalCount = 0;

    for (let i = 0; i < 7; i++) {
      const date = moment()
        .subtract(6 - i, "days")
        .format("YYYY-MM-DD");
      result.push({
        date,
        count: 0,
      });
    }

    dailyData.forEach((item) => {
      const dateStr = moment(item.date).format("YYYY-MM-DD");
      const entry = result.find((r) => r.date === dateStr);
      if (entry) {
        const count = parseInt(item.count);
        entry.count = count;
        totalCount += count;
      }
    });

    res.json({ data: result, totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLast7DaysActiveCount = async (req, res) => {
  try {
    const today = moment().endOf("day");
    const sevenDaysAgo = moment().subtract(6, "days").startOf("day");

    const dailyData = await CallList.findAll({
      attributes: [
        [fn("DATE", col("timestamp")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        timestamp: {
          [Op.between]: [sevenDaysAgo.toDate(), today.toDate()],
        },
        call_status: "active",
      },
      group: [fn("DATE", col("timestamp"))],
      order: [[fn("DATE", col("timestamp")), "ASC"]],
      raw: true,
    });

    const result = [];
    let totalCount = 0;

    for (let i = 0; i < 7; i++) {
      const date = moment()
        .subtract(6 - i, "days")
        .format("YYYY-MM-DD");
      result.push({
        date,
        count: 0,
      });
    }

    dailyData.forEach((item) => {
      const dateStr = moment(item.date).format("YYYY-MM-DD");
      const entry = result.find((r) => r.date === dateStr);
      if (entry) {
        const count = parseInt(item.count);
        entry.count = count;
        totalCount += count;
      }
    });

    res.json({ data: result, totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Lift Return calls
// exports.liftStartCall = async (req, res) => {
//   const { lift_id, agent_id } = req.body;

//   try {
//     const lift = await Elevator.findOne({ where: { elevatorid: lift_id } });
//     if (!lift) {
//       return res.status(404).json({ message: "Lift not found" });
//     }

//     const agora_channel = `lift_${lift_id}_${Date.now()}`;
//     const fullAddress = `${lift.city}, ${lift.state}, ${lift.zip}`;
//     const timestamp = new Date();

//     const newCall = await CallList.create({
//       lift_id,
//       agent_id,
//       call_status: "Outgoing",
//       address: fullAddress,
//       timestamp,
//       agora_channel,
//     });

//     const token = generateAgoraToken(agora_channel, 2, 1); // agent UID = 2
//     const uid = 2;
//     const resourceId = await acquireResource(agora_channel, uid);
//     const startRes = await startRecording(resourceId, agora_channel, uid);

//     newCall.recording_sid = startRes.sid;
//     newCall.recording_resource_id = resourceId;
//     await newCall.save();

//     // ✅ Mark as missed after 1 minute if not answered
//     setTimeout(async () => {
//       const checkCall = await CallList.findByPk(newCall.id);
//       if (checkCall && checkCall.call_status === "Outgoing") {
//         checkCall.call_status = "Missed";
//         await checkCall.save();
//         console.log(`Call ID ${checkCall.id} marked as Missed`);
//       }
//     }, 60000); // 60 seconds

//     const payload = {
//       call_id: `${newCall.id}`,
//       lift_id,
//       agora_channel,
//       token,
//       uid,
//       type: "agent_joined",
//       address: fullAddress,
//     };

//     const io = req.app.get("socketio");
//     const liftSocketId = global.connectedLifts?.[lift_id];

//     if (io && liftSocketId) {
//       io.to(liftSocketId).emit("agent-joined-call", payload);
//       console.log(`Socket sent to lift ${lift_id}`);
//     }

//     if (lift.fcm_token) {
//       await admin.messaging().sendToDevice(lift.fcm_token, { data: payload });
//       console.log("FCM sent to lift device");
//     }

//     return res.status(200).json({
//       message: "Call started by agent",
//       token,
//       uid,
//       agora_channel,
//       type: "agent_joined",
//       recording: startRes,
//     });
//   } catch (err) {
//     console.error("[liftStartCall Error]", err.message);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// };

exports.liftStartCall = async (req, res) => {
  const { lift_id, agent_id } = req.body;

  try {
    const lift = await Elevator.findOne({ where: { elevatorid: lift_id } });
    if (!lift) {
      return res.status(404).json({ message: "Lift not found" });
    }

    const agora_channel = `lift_${lift_id}_${Date.now()}`;
    const fullAddress = `${lift.city}, ${lift.state}, ${lift.zip}`;
    const timestamp = new Date();

    const newCall = await CallList.create({
      lift_id,
      agent_id,
      call_status: "Outgoing",
      address: fullAddress,
      timestamp,
      agora_channel,
    });

    setTimeout(async () => {
      try {
        const checkCall = await CallList.findByPk(newCall.id);
        if (checkCall && checkCall.call_status === "Callback") {
          checkCall.call_status = "Missed";
          await checkCall.save();
          console.log(
            `[CallController] Callback ID ${newCall.id} marked as 'Missed'.`
          );
        }
      } catch (err) {
        console.error(
          `[CallController] Error checking callback status:`,
          err.message
        );
      }
    }, 60000);

    // Agora token (agent initiator)
    const agent_uid = 2;
    const agentToken = generateAgoraToken(
      agora_channel,
      agent_uid,
      RtcRole.PUBLISHER
    );

    //Lift FCM and Socket notify
    const io = req.app.get("socketio");
    const liftSocketId = global.connectedLifts?.[lift_id];

    const payload = {
      id: newCall.id,
      lift_id,
      agent_id,
      address: fullAddress,
      agora_channel,
      timestamp,
      token: agentToken,
      uid: agent_uid,
      type: "callback_incoming",
    };

    if (io && liftSocketId) {
      io.to(liftSocketId).emit("agent-joined-call", payload);
      console.log(`Socket sent to lift ${lift_id}`);
    }

    if (lift.fcm_token) {
      await admin.messaging().sendToDevice(lift.fcm_token, { data: payload });
      console.log("FCM sent to lift device");
    }

    //  Final response to agent
    return res.status(200).json({
      message: "Callback initiated successfully",
      data: {
        call_id: newCall.id,
        agora_channel,
        token: agentToken,
        uid: agent_uid,
        address: fullAddress,
        type: "callback_incoming",
      },
    });
  } catch (err) {
    console.error("[liftStartCall Error]", err.message);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Lift receives
// exports.liftReceiveCall = async (req, res) => {
//   const { call_id } = req.body;

//   try {
//     const call = await CallList.findByPk(call_id);
//     if (!call) {
//       return res.status(404).json({ message: "Call not found" });
//     }
//     const lift = await Elevator.findOne({
//       where: { elevatorid: call.lift_id },
//     });
//     if (!lift) {
//       return res.status(404).json({ message: "Lift not found" });
//     }

//     // Set call status to active
//     call.call_status = "active";

//     const agora_channel = call.agora_channel;
//     const uid = 1; // UID for lift
//     const token = generateAgoraToken(agora_channel, uid, 1); // Role 1 = publisher

//     //  Acquire resource & start recording (if not already started)
//     const resourceId = await acquireResource(agora_channel, uid);
//     console.log("Resource acquired:", resourceId);

//     const startRes = await startRecording(resourceId, agora_channel, uid);
//     console.log("Recording started:", JSON.stringify(startRes, null, 2));

//     call.recording_sid = startRes.sid;
//     call.recording_resource_id = resourceId;

//     await call.save();

//     const payload = {
//       call_id: `${call.id}`,
//       lift_id: `${call.lift_id}`,
//       agora_channel,
//       token,
//       uid,
//       type: "lift_joined",
//       address: `${lift.city}, ${lift.state}, ${lift.zip}`,
//     };

//     //  Notify agent via Socket.IO
//     const io = req.app.get("socketio");
//     const agentSocketId = global.connectedAgents?.[call.agent_id];

//     if (io && agentSocketId) {
//       io.to(agentSocketId).emit("lift-joined-call", payload);
//       console.log(`Lift joined. Agent ${call.agent_id} notified`);
//     }

//     return res.status(200).json({
//       message: "Lift accepted call",
//       token,
//       uid,
//       agora_channel,
//       type: "lift_joined",
//       recording: startRes,
//     });
//   } catch (err) {
//     console.error("[liftReceiveCall Error]", err.message);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// };

exports.liftReceiveCall = async (req, res) => {
  const { call_id } = req.body;
  console.log(
    `[CallController] Lift receive call request for call_id: ${call_id}`
  );

  try {
    // Find the call
    const call = await CallList.findOne({ where: { id: call_id } });
    if (!call) {
      console.warn(`[CallController] Call with ID ${call_id} not found.`);
      return res.status(404).json({ message: "Call not found" });
    }

    // Find the elevator
    const lift = await Elevator.findOne({
      where: { elevatorid: call.lift_id },
    });
    if (!lift) {
      console.warn(
        `[CallController] Elevator with ID ${call.lift_id} not found.`
      );
      return res.status(404).json({ message: "Lift not found" });
    }

    //  Prevent duplicate acceptance
    if (call.call_status === "active") {
      console.warn(`[CallController] Call ID ${call_id} is already active.`);
      return res.status(400).json({ message: "Call already active" });
    }

    // Prepare Agora channel + token
    const agora_channel = call.agora_channel;
    const lift_uid = 1; // UID for lift
    const recording_uid = 999;
    const liftToken = generateAgoraToken(
      agora_channel,
      lift_uid,
      RtcRole.PUBLISHER
    );
    console.log(
      `[CallController] Agora token generated for lift UID ${lift_uid}.`
    );

    // Try to start recording (same logic as receiveCall)
    let resourceId, startRes;
    try {
      console.log(
        `[CallController] Attempting to acquire recording resource for lift...`
      );
      resourceId = await acquireResource(agora_channel, recording_uid);
      console.log(
        `[CallController] Recording resource acquired: ${resourceId}`
      );

      console.log(`[CallController] Attempting to start recording for lift...`);
      startRes = await startRecording(resourceId, agora_channel, recording_uid);
      console.log(
        `[CallController] Recording started successfully. SID: ${startRes.sid}`
      );
    } catch (recordingError) {
      console.error(
        "[CallController] Failed to start recording during liftReceiveCall:",
        recordingError.response?.data
          ? JSON.stringify(recordingError.response.data, null, 2)
          : recordingError.message
      );
      console.warn(
        "[CallController] Proceeding with call acceptance despite recording start failure."
      );
      resourceId = null;
      startRes = null;
    }

    // Update call status & save recording info
    call.call_status = "active";
    if (resourceId && startRes?.sid) {
      call.recording_sid = startRes.sid;
      call.recording_resource_id = resourceId;
      console.log("[CallController] Recording details saved to CallList DB.");
    } else {
      console.warn(
        "[CallController] Recording not started. No SID/resource ID saved."
      );
    }

    await call.save();

    //Notify agent via Socket.IO
    const io = req.app.get("socketio");
    const agentSocketId = global.connectedAgents?.[call.agent_id];

    if (io && agentSocketId) {
      const payload = {
        call_id: `${call.id}`,
        lift_id: `${call.lift_id}`,
        agora_channel,
        token: liftToken,
        uid: lift_uid,
        type: "lift_joined",
        address: `${lift.city}, ${lift.state}, ${lift.zip}`,
      };
      io.to(agentSocketId).emit("lift-joined-call", payload);
      console.log(
        `[CallController] Lift joined. Agent ${call.agent_id} notified.`
      );
    } else {
      console.warn(
        `[CallController] No active socket found for agent ${call.agent_id}.`
      );
    }

    //Send response
    return res.status(200).json({
      message: "Lift accepted call and recording initiated",
      data: {
        agora_channel,
        token: liftToken,
        uid: lift_uid,
        recording: startRes || null,
      },
    });
  } catch (error) {
    console.error(
      "[CallController] Error in liftReceiveCall:",
      error.stack || error.message
    );
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
