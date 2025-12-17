import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Text,
  VStack,
  HStack,
  Image,
  Icon,
  SimpleGrid,
  Input,
  Button,
} from '@chakra-ui/react';
import { StarIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import DashboardHeader from './DashboardHeader';
import noimg from 'assets/img/noimg.png';
import AdminNotes from './AdminNotes';
import config from 'config/config';
import {convertToUserTime} from "../timestamp";
const Notes = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [userDetails, setUserDetails] = useState([]);
  const [agentList, setAgentNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [status, setStatus] = useState('');
  const [liftId, setLiftId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAgentNotes = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/getNoteList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate, liftId, agentId }),
      });

      const result = await response.json();
      const data = result.NotesLists || [];
      setAgentNotes(data);
    } catch (error) {
      console.error('Failed to fetch agent notes:', error);
    }
  };

  useEffect(() => {
    fetchAgentNotes();
  }, []);

  // Search button handler
  const handleSearchClick = () => {
    fetchAgentNotes(startDate, endDate);
  };

  const AgentNotesUpdate = async (noteId) => {
    try {
      const response = await fetch(
        `${config.SOS_elivator}/statusNotes/${noteId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'Starred',
          }),
        },
      );

      if (response.ok) {
        fetchAgentNotes(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to update agent note status:', error);
    }
  };

  const handleEditClick = (note) => {
    setEditingNoteId(note.id);
    setStatus('Starred');
    AgentNotesUpdate(note.id);
  };

  const starredNotes = agentList.filter((note) => note.status === 'Starred');

  const renderNotes = (notes) => (
    <VStack mt={4} spacing={4}>
      {notes.map((note) => (
        <Flex
          key={note.id}
          bg="yellow.100"
          p={4}
          borderRadius="md"
          justifyContent="space-between"
          w="100%"
          boxShadow="sm"
          cursor="pointer"
          onClick={() => setUserDetails(note)}
        >
          <VStack align="start">
            <Flex justify="space-between" align="center" flexWrap="wrap" mb={2}>
              <HStack spacing={6} wrap="wrap">
                <Text fontWeight="bold" color="green.800">
                  {note.name}
                </Text>
                <Text fontWeight="bold" color="blackAlpha.800">
                  {note?.agent?.agent_id}
                </Text>
                <Text fontWeight="bold" color="blackAlpha.800">
                  {note?.agent?.lift_id}
                </Text>
                <Text fontWeight="bold" color="blackAlpha.800">
                 {convertToUserTime(note.timestamp)}
                </Text>
              </HStack>
            </Flex>
            <Text mt={1} fontSize="sm" color="gray.700">
              {note.notes}
            </Text>
          </VStack>
          <HStack spacing={4}>
            <Icon as={InfoOutlineIcon} color="blue.500" />
            <Icon
              as={StarIcon}
              color={note.status === 'Starred' ? 'yellow.400' : 'gray.400'}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(note);
              }}
              cursor="pointer"
            />
          </HStack>
        </Flex>
      ))}
    </VStack>
  );

  return (
    <Box mt={-7} ml={-5} p={4} bg="#eef2f6" minH="20vh">
      <DashboardHeader pageName="Notes" />
      <SimpleGrid
        gridTemplateColumns="60% 39%"
        spacing={4}
        mt={-40}
        textAlign="left"
      >
        <Box p={4} bg="gray.50" minH="100vh" boxShadow="md" borderRadius="lg">
          <Flex gap={4}>
            <Input
              placeholder="Agent ID"
              w="20%"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            />
            <Input
              placeholder="Lift ID"
              w="20%"
              value={liftId}
              onChange={(e) => setLiftId(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Start Date"
              w="30%"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              placeholder="End Date"
              w="30%"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button colorScheme="purple" onClick={handleSearchClick}>
              Search
            </Button>
          </Flex>

          <Tabs
            variant="enclosed"
            mt={5}
            index={tabIndex}
            onChange={(index) => setTabIndex(index)}
          >
            <TabList mb={4}>
              <Tab>Admin Notes</Tab>
              <Tab>Agent Notes</Tab>
              <Tab>Starred Notes</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text fontSize="lg" fontWeight="bold" color="purple.500">
                  Personal Notes
                </Text>
                <AdminNotes />
              </TabPanel>
              <TabPanel>
                <Text fontSize="lg" fontWeight="bold" color="purple.500" mb={4}>
                  Monitoring Agent Notes
                </Text>
                {renderNotes(agentList)}
              </TabPanel>
              <TabPanel>
                <Text fontSize="lg" fontWeight="bold" color="purple.500" mb={4}>
                  Monitoring Starred Notes
                </Text>
                {renderNotes(starredNotes)}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {tabIndex !== 0 && (
          <Box
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            p={6}
            mb={4}
            id="rightSectionColumn"
          >
            <Text
              fontSize="lg"
              mb={4}
              fontWeight="bold"
              width="100%"
              mt="20px"
              pl="10px"
            >
              Agent Details
            </Text>
            <Image src={noimg} objectFit="cover" width="100%" height="200px" />
            <Text fontSize="lg" mb={4} fontWeight="bold">
              <span style={{ fontSize: '16px' }}>Agent Name:</span>
              <br />
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {userDetails.name}
              </span>
              <br />
              <br />
              <span style={{ fontSize: '16px' }}>Address:</span>
              <br />
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {userDetails?.agent?.address}
              </span>
              <br />
              <br />
              <span style={{ fontSize: '16px' }}>Email:</span>
              <br />
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {userDetails?.agent?.agentList?.email}
              </span>
              <br />
              <br />
              <span style={{ fontSize: '16px' }}>Phone No:</span>
              <br />
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {userDetails?.agent?.agentList?.phone}
              </span>
              <br />
              <br />
              <span style={{ fontSize: '16px' }}>Lift Access:</span>
              <br />
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {userDetails?.agent?.lift_id}
              </span>
            </Text>
          </Box>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default Notes;
