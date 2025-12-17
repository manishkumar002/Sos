import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaForward,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import config from 'config/config';
const APP_ID = '468a311527c84ce6a55cd2456f6f79d9';
const AgoraCall = ({ channelName, token, uid, onCallLeave, callId }) => {
  const client = useRef(null);
  const navigate = useNavigate();
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);

  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isLocalFull, setIsLocalFull] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState('normal');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    let cancel = false;

    const init = async () => {
      try {
        client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

        client.current.on('user-published', async (user, mediaType) => {
          if (cancel) return;
          await client.current.subscribe(user, mediaType);
          if (mediaType === 'video') {
            user.videoTrack.play(remoteVideoRef.current);
          }
          if (mediaType === 'audio') {
            user.audioTrack.play();
          }
        });

        client.current.on('user-unpublished', () => {
          if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = '';
        });

        await client.current.join(APP_ID, channelName, token, uid);

        if (!cancel) setJoined(true);

        localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
        localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();

        if (cancel) return;

        await client.current.publish([
          localAudioTrack.current,
          localVideoTrack.current,
        ]);

        localVideoTrack.current.play(localVideoRef.current);
      } catch (error) {
        console.error('Agora init error:', error);
      }
    };

    init();

    return () => {
      cancel = true;

      // Sirf local resources band karo, API call mat karo
      if (localAudioTrack.current) {
        localAudioTrack.current.stop();
        localAudioTrack.current.close();
      }
      if (localVideoTrack.current) {
        localVideoTrack.current.stop();
        localVideoTrack.current.close();
      }

      client.current?.leave();
    };
  }, [channelName, token, uid]);

  const handleCallLeave = async (callId) => {
    console.log(callId, '@@@@');
    try {
      const response = await fetch(`${config.SOS_elivator}/endCall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ call_id: callId }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Call ended successfully:', result);
      return result;
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  const leaveCall = async () => {
    try {
      // Mic aur camera band karo
      if (localAudioTrack.current) {
        localAudioTrack.current.stop();
        localAudioTrack.current.close();
      }
      if (localVideoTrack.current) {
        localVideoTrack.current.stop();
        localVideoTrack.current.close();
      }

      // Agora se leave karo
      await client.current?.leave();
      setJoined(false);

      if (callId) {
        await handleCallLeave(callId);
      }

      if (onCallLeave) {
        onCallLeave(callId);
      }

      // ✅ Navigate to another page after call end
      navigate('/admin/activecall'); // Change '/your-target-route' to your desired route
    } catch (error) {
      console.error('Error leaving call:', error);
    }
  };

  const toggleMic = async () => {
    if (localAudioTrack.current) {
      await localAudioTrack.current.setEnabled(!micOn);
      setMicOn(!micOn);
    }
  };

  const toggleCamera = async () => {
    if (localVideoTrack.current) {
      await localVideoTrack.current.setEnabled(!cameraOn);
      setCameraOn(!cameraOn);
    }
  };

  const toggleVoiceSpeed = () => {
    setVoiceSpeed((prev) => (prev === 'normal' ? 'fast' : 'normal'));
    alert(`Voice speed set to ${voiceSpeed === 'normal' ? 'fast' : 'normal'}`);
  };

  const switchView = () => {
    setIsLocalFull(!isLocalFull);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        margin: 'auto',
        height: '600px',
        backgroundColor: '#1a1a1a',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Main Video */}
      <div
        ref={isLocalFull ? localVideoRef : remoteVideoRef}
        style={{
          flex: 1,
          backgroundColor: '#000',
          cursor: 'pointer',
        }}
        onClick={switchView}
      />

      {/* Picture-in-Picture */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '20px',
          width: '100px',
          height: '130px',
          border: '3px solid #00ff00',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#000',
          cursor: 'pointer',
          zIndex: 2,
        }}
        onClick={switchView}
      >
        <div
          ref={isLocalFull ? remoteVideoRef : localVideoRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Controls */}
      {joined && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '20px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '30px',
            padding: '10px 20px',
          }}
        >
          <button
            onClick={toggleMic}
            style={{
              backgroundColor: micOn ? '#007bff' : '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>

          <button
            onClick={toggleCamera}
            style={{
              backgroundColor: cameraOn ? '#28a745' : '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {cameraOn ? <FaVideo /> : <FaVideoSlash />}
          </button>

          <button
            onClick={toggleVoiceSpeed}
            style={{
              backgroundColor: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FaForward />
          </button>

          <button
            onClick={leaveCall}
            style={{
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FaPhoneSlash />
          </button>
        </div>
      )}
    </div>
  );
};

export default AgoraCall;
