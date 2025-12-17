import React, { useState, useEffect, useRef } from 'react';
import { convertToUserTime, convertToUserTime12Hour } from '../timestamp';
import AgoraCall from './AgoraCall';
import {
  Box,
  SimpleGrid,
  Text,
  Icon,
  Button,
  Flex,
  Input,
  Image,
  VStack,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { MdCall, MdOutlinePersonAddAlt } from 'react-icons/md';

import DashboardHeader from './DashboardHeader';
import 'assets/css/Dashboard.css';
import config from 'config/config';
import send from 'assets/img/send.png';
export default function WaitingCalls() {
  const intervalRef = useRef(null);
  const lastElementRef = useRef(null);
  const titleHeighlited = '#0F405B';

  const [isFetching, setIsFetching] = useState(false);
  const [selectedCallData, setSelectedCallData] = useState(null);
  const [selectedLiftId, setSelectedLiftId] = useState(null);
  const [activeCalls, setActiveCalls] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [showTechnicianBox, setShowTechnicianBox] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
  const [callId, setCallId] = useState(null);
  const [callData, setCallData] = useState(null);
  const [inCall, setInCall] = useState(false);
  const agentId = localStorage.getItem('agentId');
  const YOUR_API_KEY = 'AIzaSyAhM450WINOm2X-J_ewxJxtwmuz_Hk_Wk0';

  const handleRowClick = (liftId) => {
    setSelectedLiftId(liftId);
    setShowTechnicianBox(false);
    setSelectedTechnicianId(null);
  };

  const extractZip = (address) => {
    const match = address?.match(/\b\d{6}\b/);
    return match ? match[0] : 'N/A';
  };

  const fetchFinishedCall = async () => {
    if (isFetching) return; // Skip if already fetching
    setIsFetching(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('responseData'));
      const assignedElevators = storedUser?.user?.elevators || [];
      console.log(assignedElevators, 'assignedElevators');

      // ✅ Step 2: Call backend to get call list
      const response = await fetch(`${config?.SOS_elivator}/callLists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      const data = result?.callLists || [];

      // ✅ Step 3: Filter by "waiting" and assigned elevators only
      const filtered = data.filter(
        (call) =>
          call.call_status?.trim().toLowerCase() === 'waiting' &&
          assignedElevators?.includes(call.lift_id),
      );

      // ✅ Step 4: Update state
      setActiveCalls(filtered);

      if (filtered.length > 0) {
        setSelectedLiftId(filtered[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    } finally {
      setIsFetching(false); // Reset fetching state
    }
  };

  useEffect(() => {
    fetchFinishedCall(); // Initial fetch
    intervalRef.current = setInterval(fetchFinishedCall, 5000); // Every 5 sec

    return () => clearInterval(intervalRef?.current); // Cleanup on unmount
  }, []);

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

  const handleAccept = async (id) => {
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
      setCallData({ token, agora_channel, uid, id });
      setCallId(id);
      setInCall(true);
    } catch (err) {
      console.error('Error accepting call:', err);
    }
  };

  useEffect(() => {
    const selectedCall = activeCalls.find((call) => call.id === selectedLiftId);

    if (selectedCall) {
      setSelectedCallData(selectedCall);
    }
    // Agar selectedCall nahi mila to selectedCallData purani state me hi rahega
  }, [activeCalls, selectedLiftId]);

  console.log(selectedCallData, 'selectedCallData');

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [notesList, setNotesList] = useState([]);
  const AgentName = localStorage.getItem('agentName');
  const [agentNotes, setAgentNotes] = useState('');
  const [liftId, setLiftId] = useState('');

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

  const AgentNotesAdd = async (callId) => {
    try {
      const response = await fetch(`${config.SOS_elivator}/addNotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_id: callId,
          lift_id: liftId,
          name: AgentName,
          notes: agentNotes,
        }),
      });

      const result = await response.json();
      console.log('Added:', result);
      setAgentNotes('');
      setLiftId('');
      fetchAgentNotes();
    } catch (error) {
      console.error('Error adding agent notes:', error);
    }
  };

  const fetchAgentNotes = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/getNoteList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body to fetch all notes by default
      });

      const result = await response.json();
      const data = result.NotesLists || [];
      setNotesList(data);
    } catch (error) {
      console.error('Failed to fetch agent notes:', error);
    }
  };

  console.log(notesList, 'notesList');

  useEffect(() => {
    fetchAgentNotes();
  }, []);

  const AgentNotesUpdate = async () => {
    try {
      const response = await fetch(
        `${config.SOS_elivator}/addNotes/${editingNoteId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lift_id: liftId,
            notes: agentNotes,
          }),
        },
      );

      const result = await response.json();
      console.log('Updated:', result);
      setAgentNotes('');
      setEditingNoteId(null);
      fetchAgentNotes();
    } catch (error) {
      console.error('Error updating agent note:', error);
    }
  };

  const handleEditClick = (note) => {
    setAgentNotes(note.notes);
    setEditingNoteId(note.id);
  };

  useEffect(() => {
    if (lastElementRef.current) {
      lastElementRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [notesList]);

  // const handleCallLeave = async (callId) => {
  //     console.log(callId,"@@@@")
  //     try {
  //         const response = await fetch(`${config.SOS_elivator}/endCall`, {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({ call_id: callId }),
  //         });

  //         if (!response.ok) {
  //             throw new Error(`Server error: ${response.status}`);
  //         }

  //         const result = await response.json();
  //         console.log("Call ended successfully:", result);
  //         return result;
  //     } catch (error) {
  //         console.error("Error ending call:", error);
  //     }
  // };

  const renderNotes = (list) => {
    const filteredNotes = list.filter((note) => note?.name === AgentName);

    return (
      <VStack spacing={4} mt={6} maxH="400px">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Flex key={note.id} alignItems="flex-start" mb={2} w="100%">
              <Icon
                as={EditIcon}
                color="purple.500"
                boxSize={4}
                cursor="pointer"
                mt={2}
                mr={2}
                flexShrink={0}
                onClick={() => handleEditClick(note)}
              />

              <Box
                bg="purple.100"
                px={4}
                py={2}
                borderRadius="2xl"
                maxW="80%"
                boxShadow="base"
              >
                <Text fontSize="sm" color="gray.800" whiteSpace="pre-wrap">
                  {note.notes}
                </Text>
                <Text fontSize="8px" color="gray.500" mt={1} textAlign="right">
                  {convertToUserTime(note.timestamp)}
                </Text>
              </Box>
            </Flex>
          ))
        ) : (
          <Text color="gray.500" mt={4}>
            No notes found for you.
          </Text>
        )}

        {/* This is to make sure the "No notes found" text stays visible at the bottom */}
        <Box ref={lastElementRef}></Box>
      </VStack>
    );
  };

  if (inCall && callData) {
    return (
      <Box bg="#eef2f6" minH="100vh" p={4}>
        <DashboardHeader pageName="Live Call" />
        <Flex
          justify="space-between"
          align="flex-start"
          p={4}
          style={{ transform: 'translateY(-140px)' }}
        >
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={4} w="30%">
            <Text
              fontSize={{ base: '18px', md: '20px' }}
              mb={4}
              fontWeight="bold"
            >
              Call Location
            </Text>

            {selectedCallData?.address ? (
              <iframe
                width="100%"
                height="200"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Maps"
                src={`https://www.google.com/maps/embed/v1/place?key=${YOUR_API_KEY}&q=${encodeURIComponent(
                  selectedCallData.address,
                )}`}
              />
            ) : (
              <Text>No address available</Text>
            )}

            <Text fontSize="lg" mt={4} fontWeight="bold">
              <span style={{ fontSize: '18px' }}>Address :</span>
              <br />
              <span style={{ fontSize: '14px' }}>
                {selectedCallData?.address || 'N/A'}
              </span>
              <br />
              <span style={{ fontSize: '18px' }}>Company :</span>
              <br />
              <span style={{ fontSize: '14px' }}>
                {selectedCallData?.elevator?.company}
              </span>
              <br />
              <span style={{ fontSize: '18px' }}>User :</span>
              <br />
              <span style={{ fontSize: '14px' }}>
                {selectedCallData?.elevator?.user}
              </span>
            </Text>
          </Box>
          <Box
            width="35%"
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="md"
            textAlign="center"
          >
            <Box
              mt={4}
              bg="#ddd"
              height="100%"
              borderRadius="lg"
              overflow="hidden"
              position="relative"
            >
              <AgoraCall
                channelName={callData.agora_channel}
                token={callData.token}
                uid={callData.uid}
                role="audience"
                callId={callData.id}
              />
            </Box>
          </Box>

          <Box w="30%">
            <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={4}>
              <Text fontSize={{ base: '18px', md: '20px' }} mb={4} ms={1}>
                Technician available for Lift Id Location
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
                      selectedCallData?.elevator?.elevatorid,
                      selectedTechnicianId,
                    )
                  }
                  isDisabled={!selectedTechnicianId}
                >
                  Confirm
                </Button>
              </Flex>
            </Box>
            <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={4}>
              <Text fontSize={{ base: '18px', md: '20px' }} mb={4}>
                Notes
              </Text>

              <Box
                maxH="200px" // aap is height ko apni requirement ke mutabiq adjust kar sakte hain
                overflowY="auto"
                pr={2} // right padding for scrollbar space
              >
                {renderNotes(notesList)}
              </Box>

              <InputGroup mt={5}>
                <Input
                  placeholder="Type Notes Here..."
                  bg="white"
                  value={agentNotes}
                  onChange={(e) => setAgentNotes(e.target.value)}
                  borderRadius="full"
                />
                <InputRightElement>
                  <Image
                    src={send}
                    boxSize="20px"
                    alt="Send Icon"
                    // onClick={() => AgentNotesAdd(callId)}
                    onClick={() =>
                      editingNoteId ? AgentNotesUpdate() : AgentNotesAdd(callId)
                    }
                    cursor="pointer"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
          </Box>
        </Flex>
      </Box>
    );
  }
  return (
    <Box mt={-7} ml={-5} p={0} bg="#eef2f6" minH="100vh">
      <DashboardHeader pageName="Waiting Calls" />
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={4}
        mt={-40}
        mb={0}
        mr={-4}
        ml={2}
      >
        <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={7} w="100%">
          <Text
            fontSize="20px"
            mb={4}
            fontWeight="bold"
            color={titleHeighlited}
          >
            Waiting Calls
          </Text>
          <ul
            style={{
              display: 'grid',
              gridTemplateColumns: '25% 25% 35% 20%',
              fontWeight: 'bold',
              height: '40px',
              paddingTop: '6px',
              paddingLeft: '12px',
            }}
          >
            <li className="callsHeaderTitle">Lift ID</li>
            <li className="callsHeaderTitle">Time</li>
            <li className="callsHeaderTitle">Location</li>
            <li className="callsHeaderTitle">Action</li>
          </ul>
          {activeCalls.map((call, index) => {
            const isSelected = call.id === selectedLiftId;
            // const timeIST = new Date(call.timestamp).toLocaleTimeString(
            //   'en-IN',
            //   {
            //     hour: '2-digit',
            //     minute: '2-digit',
            //     hour12: true,
            //     timeZone: 'Asia/Kolkata',
            //   },
            // );
            return (
              <ul
                key={index}
                onClick={() => handleRowClick(call.id)}
                className={`lift-row ${isSelected ? 'selected' : ''}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '25% 18% 40% 20%',
                  cursor: 'pointer',
                  height: '50px',
                  paddingLeft: '12px',
                }}
              >
                <li>{call.lift_id}</li>
                <li style={{ color: 'green' }}>
                  {convertToUserTime12Hour(call.timestamp)}
                </li>
                <li>{call.address}</li>
                <li>
                  <Button
                    colorScheme="green"
                    size="sm"
                    style={{ transform: 'translateY(-5px)' }}
                    onClick={() => {
                      handleAccept(call.id);
                      handleZipClick(extractZip(call.address));
                    }}
                  >
                    Answer
                  </Button>

                  <Icon
                    as={MdOutlinePersonAddAlt}
                    w={6}
                    h={6}
                    color="#662FF2"
                    cursor="pointer"
                    onClick={() => handleZipClick(extractZip(call.address))}
                    ml={2}
                  />
                </li>
              </ul>
            );
          })}
        </Box>
        <SimpleGrid columns={1} spacing={4} mb={0}>
          {!showTechnicianBox ? (
            <Box Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={4}>
              <Text
                fontSize={{ base: '18px', md: '20px' }}
                mb={4}
                fontWeight="bold"
              >
                Call Location
              </Text>

              {selectedCallData?.address ? (
                <iframe
                  width="100%"
                  height="200"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Google Maps"
                  src={`https://www.google.com/maps/embed/v1/place?key=${YOUR_API_KEY}&q=${encodeURIComponent(
                    selectedCallData.address,
                  )}`}
                />
              ) : (
                <Text>No address available</Text>
              )}

              <Text fontSize="lg" mt={4} fontWeight="bold">
                <span style={{ fontSize: '18px' }}>Address :</span>
                <br />
                <span style={{ fontSize: '14px' }}>
                  {selectedCallData?.address || 'N/A'}
                </span>
                <br />
                <span style={{ fontSize: '18px' }}>Company :</span>
                <br />
                <span style={{ fontSize: '14px' }}>
                  {selectedCallData?.elevator?.company}
                </span>
                <br />
                <span style={{ fontSize: '18px' }}>User :</span>
                <br />
                <span style={{ fontSize: '14px' }}>
                  {selectedCallData?.elevator?.user}
                </span>
              </Text>
            </Box>
          ) : (
            <Box Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={4}>
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
                      selectedCallData?.elevator?.elevatorid,
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
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
