// DemoCalling.jsx
import React, { useState } from 'react';
import AgoraCall from './AgoraCall';
import config from 'config/config';

function DemoCalling() {
  const [liftId, setLiftId] = useState('');
  const [callData, setCallData] = useState(null);

  const handleCreateCall = async () => {
    try {
      const res = await fetch(`${config.SOS_elivator}/createCallList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lift_id: liftId }),
      });

      const data = await res.json();
      if (res.ok) {
        setCallData(data.data); // { token, agora_channel, uid }
      } else {
        console.error('Call creation failed:', data.message);
      }
    } catch (err) {
      console.error('Error creating call:', err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={liftId}
        onChange={(e) => setLiftId(e.target.value)}
        placeholder="Enter Lift ID"
      />
      <button onClick={handleCreateCall}>Start Call</button>

      {callData && (
        <AgoraCall
          channelName={callData.agora_channel}
          token={callData.token}
          uid={callData.uid}
          role="host"
        />
      )}
    </div>
  );
}

export default DemoCalling;
