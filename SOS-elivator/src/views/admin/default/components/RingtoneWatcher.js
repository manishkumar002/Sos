import { useEffect, useRef } from 'react';
import config from 'config/config';

export default function RingtoneWatcher() {
  const previousCallIdsRef = useRef([]);
  const ringtoneRef = useRef(null);
  useEffect(() => {
    ringtoneRef.current = new Audio('/ringtone.mp3');
    ringtoneRef.current.loop = true;
    ringtoneRef.current.volume = 1.0;
    ringtoneRef.current.muted = true;

    ringtoneRef.current.play().catch((e) => {
      console.warn('Initial muted play failed:', e);
    });
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current = null;
      }
    };
  }, []);

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current.muted = true;
      console.log('Ringtone stopped');
    }
  };

  const playRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.muted = false;
      ringtoneRef.current.play().catch((e) => {
        console.warn('Play ringtone failed:', e);
      });
      console.log('Ringtone playing');
    }
  };

  const fetchCalls = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('responseData'));
      const assignedElevators = storedUser?.user?.elevators || [];
      console.log(assignedElevators, 'assignedElevators');

      const response = await fetch(`${config.SOS_elivator}/callLists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const result = await response.json();
      const data = result.callLists || [];

      const waitingCalls = data.filter(
        (call) =>
          call.call_status?.trim().toLowerCase() === 'waiting' &&
          assignedElevators.includes(call.lift_id),
      );

      const currentIds = waitingCalls.map((call) => call.id);
      previousCallIdsRef.current = currentIds;

      if (waitingCalls.length > 0) {
        playRingtone();
      } else {
        stopRingtone();
      }
    } catch (err) {
      console.error('Failed to fetch call list:', err);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || role.toLowerCase() !== 'agent') {
      console.log('Not an agent, watcher not started');
      return;
    }

    const intervalId = setInterval(fetchCalls, 5000);

    return () => {
      clearInterval(intervalId);
      stopRingtone();
    };
  }, []);

  return null;
}
