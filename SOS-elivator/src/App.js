// import './assets/css/App.css';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import AuthLayout from './layouts/auth';
// import AdminLayout from './layouts/admin';
// import RTLLayout from './layouts/rtl';
// import React from 'react';
// import theme from 'theme/theme';
// import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
// import { ChakraProvider } from '@chakra-ui/react';
// import initialTheme from './theme/theme'; //  { themeGreen }
// import { useState } from 'react';

// export default function Main() {
//   const [currentTheme, setCurrentTheme] = useState(initialTheme);
//   return (
//     <ChakraProvider theme={theme}>
//       <React.StrictMode>
//         <ThemeEditorProvider>
//           <Routes>
//             <Route path="auth/*" element={<AuthLayout />} />
//             <Route
//               path="admin/*"
//               element={
//                 <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
//               }
//             />
//             <Route
//               path="rtl/*"
//               element={
//                 <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
//               }
//             />
//             <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
//           </Routes>
//         </ThemeEditorProvider>
//       </React.StrictMode>
//     </ChakraProvider>
//   );
// }

import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { ChakraProvider, useToast, Button, Box, Text } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import AgoraCall from './views/admin/default/components/AgoraCall';
import config from './config/config';
import RingtoneWatcher from '../src/views/admin/default/components/RingtoneWatcher';
export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const toast = useToast();
  const [socket, setSocket] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callData, setCallData] = useState(null);
  const [callId, setCallId] = useState(null);
  const agentId = localStorage.getItem('agentId');

  // Handle Accept Call
  const handleAccept = async (id) => {
    toast.close('incoming-call-toast');
    try {
      const res = await fetch(`${config.SOS_elivator}/receiveCall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_id: id,
          agent_id: agentId,
        }),
      });

      const result = await res.json();
      const { token, agora_channel, uid } = result.data;
      setCallData({ token, agora_channel, uid });
    } catch (err) {
      console.error('Error accepting call:', err);
    }
  };

  //  Handle Reject Call
  const handleReject = () => {
    if (socket && agentId) {
      socket.emit('call-ended', { agentId });
    }
    toast.close('incoming-call-toast');
    setIncomingCall(null);
  };

  // Setup socket connection once
  useEffect(() => {
    //const newSocket = io('http://localhost:5000');
    const newSocket = io('https://livesos.ilearnings.in/');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('register-agent', agentId);
    });

    newSocket.on('incoming-call', (data) => {
      console.log('Incoming call:', data);

      setIncomingCall(data);
      setCallId(data.id);

      // if (!toast.isActive('incoming-call-toast')) {
      //   toast({
      //     id: 'incoming-call-toast',
      //     position: 'top-right',
      //     duration: null,
      //     isClosable: true,
      //     render: () => (
      //       <Box bg="blue.500" color="white" p={4} borderRadius="md">
      //         <Text fontWeight="bold">New Call from Lift {data.lift_id}</Text>
      //         <Text mb={3}>Location: {data.address}</Text>
      //         <Button
      //           colorScheme="green"
      //           size="sm"
      //           mr={2}
      //           onClick={() => handleAccept(data.id)}
      //         >
      //           Accept
      //         </Button>
      //         <Button colorScheme="red" size="sm" onClick={handleReject}>
      //           Reject
      //         </Button>
      //       </Box>
      //     ),
      //   });
      // }
    });

    // newSocket.on('stop-notification', () => {
    //   toast.close('incoming-call-toast');
    //   setIncomingCall(null);
    // });

    return () => {
      newSocket.disconnect();
    };
  }, [toast, agentId]);

  return (
    <ChakraProvider theme={theme}>
      <RingtoneWatcher />
      <React.StrictMode>
        <ThemeEditorProvider>
          {callData ? (
            <AgoraCall
              channelName={callData.agora_channel}
              token={callData.token}
              uid={callData.uid}
              role="audience"
            />
          ) : (
            <Routes>
              <Route path="auth/*" element={<AuthLayout />} />
              <Route
                path="admin/*"
                element={
                  <AdminLayout
                    theme={currentTheme}
                    setTheme={setCurrentTheme}
                  />
                }
              />
              <Route
                path="rtl/*"
                element={
                  <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
                }
              />
              <Route
                path="/"
                element={<Navigate to="/auth/sign-in" replace />}
              />
            </Routes>
          )}
        </ThemeEditorProvider>
      </React.StrictMode>
    </ChakraProvider>
  );
}
