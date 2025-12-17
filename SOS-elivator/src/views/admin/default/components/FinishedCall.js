import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Icon,
  Image,
  Button,
  Flex,
} from '@chakra-ui/react';
import { MdCall, MdOutlinePersonAddAlt } from 'react-icons/md';
import callRec from 'assets/img/callrecording.png';
import { convertToUserTime12Hour } from '../timestamp';
import DashboardHeader from './DashboardHeader';
import 'assets/css/Dashboard.css';
import config from 'config/config';
import AgoraCall from './AgoraCall';

export default function ActiveCall() {
  const titleHeighlited = '#0F405B';

  const [selectedLiftId, setSelectedLiftId] = useState(null);
  const [finishedCalls, setFinishedCalls] = useState([]);
  const [showTechnicianBox, setShowTechnicianBox] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [callData, setCallData] = useState(null);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    fetchFinishedCall();
  }, []);

  const fetchFinishedCall = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('responseData'));
      const agentUniqueId = storedUser?.user?.unique_id;
      const role = storedUser?.user?.role; // user's role

      if (!role) {
        console.warn('User role not found');
        return;
      }

      const response = await fetch(`${config.SOS_elivator}/callLists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      const data = result.callLists || [];

      console.log(data, 'data');

      let filtered;

      if (role === 'agent') {
        // Only show finished calls for this agent
        filtered = data.filter(
          (call) =>
            call.call_status?.trim().toLowerCase() === 'finished' &&
            call.agent_id === agentUniqueId,
        );
      } else {
        // Admin/User can see all finished calls
        filtered = data.filter(
          (call) => call.call_status?.trim().toLowerCase() === 'finished',
        );
      }

      setFinishedCalls(filtered);

      if (filtered.length > 0) {
        setSelectedLiftId(filtered[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    }
  };

  const extractZip = (address) => {
    const match = address?.match(/\b\d{6}\b/);
    return match ? match[0] : 'N/A';
  };

  const handleZipClick = async (zip) => {
    if (!zip) return;
    try {
      const response = await fetch(
        `${config.SOS_elivator}/getTechniciansByZip?zip=${zip}`,
      );
      const result = await response.json();
      setTechnicians(result);
      setShowTechnicianBox(true);
    } catch (error) {
      console.error('Failed to fetch technicians:', error);
    }
  };

  const assignTask = async (elevator_id, technician_id) => {
    if (!elevator_id || !technician_id) return;
    try {
      const response = await fetch(`${config.SOS_elivator}/taskAssigned`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elevator_id, technician_id }),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Technician assigned successfully!');
        setSelectedTechnicianId(null);
      } else {
        console.error('Error assigning task:', result.message || result);
      }
    } catch (error) {
      console.error('Network error while assigning task:', error);
    }
  };

  const storedUser = JSON.parse(localStorage.getItem('responseData'));
  const role = storedUser?.user?.role;
  const callBack = async (lift_id, agent_id, role) => {
    try {
      //  Only agents can start the call
      if (role !== 'agent') {
        alert('Only agents can start a call.');
        console.warn('Access denied: Only agents can start a call.');
        return;
      }

      const res = await fetch(`${config.SOS_elivator}/liftStartCall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lift_id, agent_id }),
      });

      const data = await res.json();

      if (res.ok) {
        setCallData(data);

        setIsCalling(true);
        console.log('Call started successfully:', data);
      } else {
        console.error('Call creation failed:', data.message);
        alert(data.message || 'Failed to start call');
      }
    } catch (err) {
      console.error('Error creating call:', err);
      alert('Something went wrong while starting the call.');
    }
  };

  const selectedCall = finishedCalls.find((call) => call.id === selectedLiftId);
  const YOUR_API_KEY = 'AIzaSyAhM450WINOm2X-J_ewxJxtwmuz_Hk_Wk0';

  return (
    <Box mt={-7} ml={-5} p={0} bg="#eef2f6" minH="100vh">
      <DashboardHeader pageName="Finished Calls" />

      {!isCalling && (
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={4}
          mt={-40}
          mb={0}
          mr={-4}
          ml={2}
        >
          {/* Left Side - Call List */}
          <Box
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            p={6}
            mb={7}
            w="100%"
          >
            <Text
              fontSize={{ base: '18px', md: '20px' }}
              mb={4}
              fontWeight="bold"
              color={titleHeighlited}
            >
              Finished Calls
            </Text>

            <ul
              style={{
                display: 'grid',
                gridTemplateColumns: '20% 14% 25% 30% 10%',
                fontWeight: 'bold',
                height: '40px',
                paddingTop: '6px',
                paddingLeft: '12px',
              }}
            >
              <li className="callsHeaderTitle">Lift ID</li>
              <li className="callsHeaderTitle">Time</li>
              <li className="callsHeaderTitle">Agent ID</li>
              <li className="callsHeaderTitle">Location</li>
              <li className="callsHeaderTitle">Action</li>
            </ul>

            {finishedCalls.map((call, index) => {
              const isSelected = call.id === selectedLiftId;
              return (
                <ul
                  key={index}
                  onClick={() => setSelectedLiftId(call.id)}
                  className={`lift-row ${isSelected ? 'selected' : ''}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '20% 15% 15% 38% 40%',
                    cursor: 'pointer',
                    height: '50px',
                    paddingLeft: '12px',
                  }}
                >
                  <li style={{ paddingTop: '3px' }}>{call.lift_id}</li>
                  <li style={{ paddingTop: '3px', color: 'green' }}>
                    {convertToUserTime12Hour(call.timestamp)}
                  </li>
                  <li style={{ paddingTop: '3px', color: 'green' }}>
                    {call.agent_id}
                  </li>
                  <li style={{ paddingTop: '3px' }}>{call.address}</li>
                  <li style={{ paddingTop: '3px' }}>
                    <Icon
                      as={MdCall}
                      w={6}
                      h={6}
                      color="#34BE53"
                      mr={2}
                      cursor="pointer"
                      onClick={() =>
                        callBack(call.lift_id, call.agent_id, role)
                      }
                    />
                    <Icon
                      as={MdOutlinePersonAddAlt}
                      w={6}
                      h={6}
                      color="#662FF2"
                      cursor="pointer"
                      onClick={() => handleZipClick(extractZip(call.address))}
                    />
                  </li>
                </ul>
              );
            })}
          </Box>

          {/* Right Side */}
          <SimpleGrid columns={1} spacing={4} mb={0}>
            {!showTechnicianBox ? (
              <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={4}>
                <Text
                  fontSize={{ base: '18px', md: '20px' }}
                  mb={4}
                  fontWeight="bold"
                >
                  Call Location
                </Text>

                {selectedCall?.address ? (
                  <iframe
                    width="100%"
                    height="200"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Google Maps"
                    src={`https://www.google.com/maps/embed/v1/place?key=${YOUR_API_KEY}&q=${encodeURIComponent(
                      selectedCall.address,
                    )}`}
                  />
                ) : (
                  <Text>No address available</Text>
                )}

                <Text fontSize="lg" mt={4} fontWeight="bold">
                  <span style={{ fontSize: '16px' }}>Address</span>
                  <br />
                  <span style={{ fontSize: '18px' }}>
                    {selectedCall?.address || 'N/A'}
                  </span>
                </Text>
              </Box>
            ) : (
              <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={4}>
                <Text
                  fontSize={{ base: '18px', md: '20px' }}
                  mb={4}
                  fontWeight="bold"
                >
                  Assign Technician
                </Text>

                {technicians.length === 0 ? (
                  <Text>No technicians found for this ZIP.</Text>
                ) : (
                  <Box
                    as="table"
                    width="100%"
                    style={{ borderCollapse: 'collapse' }}
                  >
                    <thead>
                      <tr style={{ borderBottom: '1px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>
                          Name
                        </th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>
                          Status
                        </th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>
                          Select
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {technicians.map((tech, index) => (
                        <tr
                          key={index}
                          style={{
                            borderBottom: '1px solid #eee',
                            backgroundColor:
                              selectedTechnicianId === tech.id
                                ? '#f0f0ff'
                                : 'white',
                          }}
                        >
                          <td style={{ padding: '8px' }}>{tech.name}</td>
                          <td style={{ padding: '8px' }}>{tech.status}</td>
                          <td style={{ padding: '8px' }}>
                            <Icon
                              as={MdOutlinePersonAddAlt}
                              w={6}
                              h={6}
                              color={
                                selectedTechnicianId === tech.techunique_id
                                  ? 'green.500'
                                  : 'purple.600'
                              }
                              cursor="pointer"
                              onClick={() =>
                                setSelectedTechnicianId(tech.techunique_id)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Box>
                )}

                <Flex justify="center" mt={6}>
                  <Button
                    colorScheme="purple"
                    onClick={() =>
                      assignTask(
                        selectedCall?.elevator?.elevatorid,
                        selectedTechnicianId,
                      )
                    }
                    isDisabled={!selectedTechnicianId}
                  >
                    Confirm
                  </Button>
                </Flex>
              </Box>
            )}

            <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={8}>
              <Text
                fontSize={{ base: '18px', md: '20px' }}
                mb={4}
                fontWeight="bold"
              >
                Call Recording
              </Text>
              <Image
                src={callRec}
                alt="Call Recording"
                objectFit="cover"
                width="100%"
                height="200px"
              />
            </Box>
          </SimpleGrid>
        </SimpleGrid>
      )}

      {/* Agora Call Full Screen */}
      {callData && isCalling && (
        <AgoraCall
          channelName={callData.agora_channel}
          token={callData.token}
          uid={callData.uid}
          role="agent_joined"
        />
      )}
    </Box>
  );
}
