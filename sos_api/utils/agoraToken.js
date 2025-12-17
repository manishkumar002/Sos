// const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// const APP_ID = "468a311527c84ce6a55cd2456f6f79d9";
// const APP_CERTIFICATE = "d2a1755e8c774f8f8671aa23ce102ff0";

// function generateAgoraToken(channelName, uid, role) {
//   const expirationTimeInSeconds = 3600;
//   const currentTimestamp = Math.floor(Date.now() / 1000);
//   const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

//   return RtcTokenBuilder.buildTokenWithUid(
//     APP_ID,
//     APP_CERTIFICATE,
//     channelName,
//     uid,
//     role,
//     privilegeExpiredTs
//   );
// }

// module.exports = generateAgoraToken;

// agoraToken.js
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const APP_ID = "468a311527c84ce6a55cd2456f6f79d9";
const APP_CERTIFICATE = "d2a1755e8c774f8f8671aa23ce102ff0";

function generateAgoraToken(channelName, uid, role) {
  const expirationTimeInSeconds = 3600; // Token valid for 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  console.log(
    `[AgoraToken] Generating token for channel: ${channelName}, UID: ${uid}, Role: ${role}`
  );

  return RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
}

module.exports = generateAgoraToken;
