// agoraRecordingService.js
const axios = require("axios");
require("dotenv").config(); // Ensure dotenv is configured if you're using .env for secrets
const service_account_googleCloud = require("./service_account_googleCloud.json");
const generateAgoraToken = require("./agoraToken");
const { RtcRole } = require("agora-access-token"); // Import RtcRole for direct use

// Replace with your actual Agora App ID, Customer ID (REST API Key), and Customer Certificate (REST API Secret)
const AGORA_APP_ID = "468a311527c84ce6a55cd2456f6f79d9";
const CUSTOMER_ID = "8e10d8207b31454b99609afeefb5c691";
const CUSTOMER_CERTIFICATE = "dab56b776f8542b98a90fdec52994623"; // REST API Secret

const AGORA_BASE_URL = "https://api.sd-rtn.com/v1/apps";

const auth = {
  username: CUSTOMER_ID,
  password: CUSTOMER_CERTIFICATE,
};

exports.acquireResource = async (channelName, uid) => {
  const url = `${AGORA_BASE_URL}/${AGORA_APP_ID}/cloud_recording/acquire`;
  console.log(
    `[RecordingService] Acquiring resource for channel: ${channelName}, UID: ${uid}`
  );

  try {
    const response = await axios.post(
      url,
      {
        cname: channelName,
        uid: uid.toString(), // UID must be a string for the API
        clientRequest: {}, // Can include optional recording mode settings if needed
      },
      { auth }
    );
    console.log(
      "[RecordingService] Acquire Resource Response:",
      JSON.stringify(response.data, null, 2)
    );
    if (!response.data.resourceId) {
      throw new Error("resourceId not found in acquire response.");
    }
    return response.data.resourceId;
  } catch (error) {
    console.error(
      "[RecordingService] Failed to acquire resource:",
      error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
    );
    throw error; // Re-throw to be handled by the caller
  }
};

exports.startRecording = async (resourceId, channelName, uid) => {
  const token = generateAgoraToken(channelName, uid, RtcRole.PUBLISHER);
  console.log(
    `[RecordingService] Generated token for recording UID ${uid}: ${token}`
  );

  const url = `${AGORA_BASE_URL}/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`;
  console.log(
    `[RecordingService] Starting recording for resourceId: ${resourceId}, channel: ${channelName}, UID: ${uid}`
  );

  try {
    const response = await axios.post(
      url,
      {
        cname: channelName,
        uid: uid.toString(),
        clientRequest: {
          token: token,
          recordingConfig: {
            maxIdleTime: 120,
            streamTypes: 2, // 2 means record both audio + video
            channelType: 1,
            videoStreamType: 0,
            recordingFileConfig: {
              avFileType: ["mp4"], // ✅ Save as MP4 (audio + video)
            },
            transcodingConfig: {
              width: 640,
              height: 360,
              fps: 15,
              bitrate: 600,
              mixedVideoLayout: 1, // Composite video layout
              backgroundColor: "#000000",
            },
          },
          storageConfig: {
            vendor: 2, // Google Cloud Storage
            region: 0,
            bucket: "agora-recordings-bucket",
            accessKey: process.env.GCP_HMAC_ACCESS_KEY,
            secretKey: process.env.GCP_HMAC_SECRET_KEY,
            fileNamePrefix: ["recordings"], // Store inside /recordings/
          },
        },
      },
      { auth }
    );
    console.log(
      "[RecordingService] Start Recording Response:",
      JSON.stringify(response.data, null, 2)
    );
    if (!response.data.sid) {
      throw new Error("SID not found in start recording response.");
    }
    return response.data;
  } catch (error) {
    console.error(
      "[RecordingService] Failed to start recording:",
      error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
    );
    throw error;
  }
};

exports.stopRecording = async (resourceId, sid, channelName, uid) => {
  const url = `${AGORA_BASE_URL}/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`;
  console.log(
    `[RecordingService] Stopping recording for resourceId: ${resourceId}, SID: ${sid}`
  );

  try {
    const response = await axios.post(
      url,
      {
        cname: channelName,
        uid: uid.toString(),
        clientRequest: {},
      },
      { auth }
    );

    console.log(
      "[RecordingService] Agora Stop Recording Response:",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (error) {
    console.error(
      "[RecordingService] Failed to stop recording:",
      error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
    );
    if (
      error.response?.status === 404 &&
      error.response.data?.reason === "failed to find worker"
    ) {
      console.warn(
        "[RecordingService] Recording worker not found. It might have already stopped or never started successfully."
      );
    }
    throw error;
  }
};

// const axios = require("axios");
// require("dotenv").config();
// const service_account_googleCloud = require("./service_account_googleCloud.json");
// const generateAgoraToken = require("./agoraToken");

// const AGORA_APP_ID = "468a311527c84ce6a55cd2456f6f79d9";
// const CUSTOMER_ID = "8e10d8207b31454b99609afeefb5c691";
// const CUSTOMER_CERTIFICATE = "dab56b776f8542b98a90fdec52994623";

// const AGORA_BASE_URL = "https://api.sd-rtn.com/v1/apps";

// const auth = {
//   username: CUSTOMER_ID,
//   password: CUSTOMER_CERTIFICATE,
// };

// // ✅ Step 1: Acquire resourceId
// exports.acquireResource = async (channelName, uid) => {
//   const url = `${AGORA_BASE_URL}/${AGORA_APP_ID}/cloud_recording/acquire`;
//   const response = await axios.post(
//     url,
//     {
//       cname: channelName,
//       uid: uid.toString(),
//       clientRequest: {},
//     },
//     { auth }
//   );

//   return response.data.resourceId;
// };

// // ✅ Step 2: Start recording and save to GCP
// exports.startRecording = async (resourceId, channelName, uid) => {
//   const token = generateAgoraToken(channelName, uid); // Token for UID 999

//   const url = `${AGORA_BASE_URL}/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`;

//   const response = await axios.post(
//     url,
//     {
//       cname: channelName,
//       uid: uid.toString(),
//       clientRequest: {
//         token,
//         recordingConfig: {
//           maxIdleTime: 120,
//           streamTypes: 2,
//           channelType: 1,
//           videoStreamType: 0,
//           transcodingConfig: {
//             width: 640,
//             height: 360,
//             bitrate: 500,
//             fps: 15,
//             layout: 1,
//             backgroundColor: "#000000",
//           },
//         },
//         storageConfig: {
//           vendor: 6,
//           region: 0,
//           bucket: "agora-recordings-bucket",
//           accessKey: service_account_googleCloud.client_email,
//           secretKey: service_account_googleCloud.private_key.replace(
//             /\\n/g,
//             "\n"
//           ),
//           fileNamePrefix: ["recordings"],
//         },
//       },
//     },
//     { auth }
//   );

//   return response.data;
// };

// // ✅ Step 3: Stop recording
// exports.stopRecording = async (resourceId, sid, channelName, uid) => {
//   const url = `${AGORA_BASE_URL}/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`;

//   try {
//     const response = await axios.post(
//       url,
//       {
//         cname: channelName,
//         uid: uid.toString(),
//         clientRequest: {},
//       },
//       { auth }
//     );

//     console.log("Agora stop response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Failed to stop recording:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };
