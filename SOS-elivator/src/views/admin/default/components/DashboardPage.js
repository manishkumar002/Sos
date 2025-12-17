import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Icon,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  MdCall,
  MdCallEnd,
  MdAddCall,
  MdOutlineSearch,
} from 'react-icons/md';

import DashboardHeader from './DashboardHeader';
import DashboardActiveCalls from './DashboardActiveCalls';
import DashboardFinishedCalls from './DashboardFinishedCalls';
import DashboardWaitingCalls from './DashboardWaitingCalls';

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('dashboardActiveCalls'); // Track the current active section
const [elevatorId, setElevatorId] = useState('');
const [agentId, setAgentId] = useState('');
const [searchTriggered, setSearchTriggered] = useState(false);

  const handleSectionClick = (section) => {
    setActiveSection(section); // Update the active section on card click
  };

 const handleSearch = () => {
  if (!elevatorId && !agentId) {
    alert("Please enter Elevator ID or Agent ID");
    return;
  }

  setSearchTriggered(prev => !prev);
   // Toggle to trigger search
};
   const [callsCounts, setCallsCounts] = useState({
    activeCount:0,
    finishedCount:0,
    waitingCount:0,
    });
  

  return (
    <Box
      mt={{ base: 0, md: -7 }}
      ml={{ base: 0, md: -5 }}
      //p={0}
      bg="#eef2f6"
      minH="100vh"
      padding="0px"
    >
      {/* Dashboard Header */}
      <DashboardHeader pageName="Dashboard" />

      <SimpleGrid
        columns={{ base: 1, md: 2 }} // Makes grid 1 column on mobile, 2 columns on larger screens
        mt={{ base: -10, md: -40 }} // Adjust margin-top for mobile and larger screens
        spacing={4}
        mb={4}
        mr={-4}
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} // Adjusts the grid layout for mobile
      >
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          spacing={4}
          mb={0}
          mr={0}
          ml={2}
        >
          {/* Active Calls Card */}
          <Box
            onClick={() => handleSectionClick('dashboardActiveCalls')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardActiveCalls'
                ? 'linear-gradient(90deg, #2A2B2D, #011A4D)'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={6}
            height="90px"
            color={
              activeSection === 'dashboardActiveCalls' ? '#A4BBF9' : '#0F405B'
            }
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Icon
              as={MdCall}
              w={8}
              h={8}
              ml={-3}
              color="#6FAAF8"
              bg="white"
              borderRadius="15"
              padding="5px"
            />
            <Box textAlign="right">
              <Text fontSize="sm">Active Calls</Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
              {callsCounts.activeCount}
              </Text>
            </Box>
          </Box>

          {/* Finished Calls Card */}
          <Box
            onClick={() => handleSectionClick('dashboardFinishedCalls')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardFinishedCalls'
                ? 'linear-gradient(90deg, #7C2ECE, #2A2B2D)'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={6}
            height="90px"
            color={
              activeSection === 'dashboardFinishedCalls' ? '#A4BBF9' : '#0F405B'
            }
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Icon
              as={MdCallEnd}
              w={8}
              h={8}
              ml={-3}
              color="#7C2ECE"
              bg="white"
              borderRadius="15"
              padding="5px"
            />
            <Box textAlign="right">
              <Text
                color={
                  activeSection === 'dashboardFinishedCalls'
                    ? 'white'
                    : '#A3AED0'
                }
                style={{ fontSize: '14px' }}
              >
                Finished Calls
              </Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
              {callsCounts.finishedCount}
              </Text>
            </Box>
          </Box>

          {/* Waiting Calls Card */}
          <Box
            onClick={() => handleSectionClick('dashboardWaitingCalls')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardWaitingCalls'
                ? 'linear-gradient(90deg, #6DBE45, #2A2B2D)'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={4}
            height="90px"
            color={
              activeSection === 'dashboardWaitingCalls' ? '#A4BBF9' : '#0F405B'
            }
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Icon
              as={MdAddCall}
              w={8}
              h={8}
              color="green"
              bg="white"
              borderRadius="15"
              padding="5px"
            />
            <Box textAlign="right">
              <Text
                fontSize="sm"
                color={
                  activeSection === 'dashboardWaitingCalls'
                    ? 'white'
                    : '#A3AED0'
                }
                style={{ fontSize: '14px' }}
              >
                Waiting Calls
              </Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
              {callsCounts.waitingCount}
              </Text>
            </Box>
          </Box>

        </SimpleGrid>

        {/* Search Filters */}
        <SimpleGrid
          columns={{ base: 3, sm: 2, md: 1 }}
          spacing={4}
          mb={0}
          ml={2}
        >
          <Box bg="white" p={3} borderRadius="15px" boxShadow="lg">
            <Text mb={1} mt={0} fontSize="14px" color="#A3AED0">
              Custom Search
            </Text>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={4}
              gridTemplateColumns={{ base: '1fr', md: '35% 35% 23%' }} // Adjust layout for mobile and larger screens
            >
               <Box>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<MdOutlineSearch color="#0F405B" />} />
          <Input
            placeholder="Elevator ID"
            value={elevatorId}
            onChange={(e) => setElevatorId(e.target.value)}
            borderRadius="25px"
            bg="#F4F7FE"
            height="40px"
            fontSize="14px"
          />
        </InputGroup>
      </Box>

                <Box>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<MdOutlineSearch color="#0F405B" />} />
          <Input
            placeholder="Agent ID"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            borderRadius="25px"
            bg="#F4F7FE"
            height="40px"
            fontSize="14px"
          />
        </InputGroup>
      </Box>

              <Box>
        <Button
          colorScheme="teal"
          width="100%"
          height="40px"
          borderRadius="25px"
          bg="#0F405B"
          color="white"
          fontSize="14px"
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </SimpleGrid>

      {/* Display Component Based on Active Section */}
      {activeSection === 'dashboardActiveCalls' && <DashboardActiveCalls setCallsCounts={setCallsCounts}  elevatorId={elevatorId}
        agentId={agentId} searchTriggered={searchTriggered} />}
      {activeSection === 'dashboardFinishedCalls' && <DashboardFinishedCalls  elevatorId={elevatorId}
        agentId={agentId} searchTriggered={searchTriggered} />}
      {activeSection === 'dashboardWaitingCalls' && <DashboardWaitingCalls />}
    </Box>
  );
};

export default DashboardPage;
