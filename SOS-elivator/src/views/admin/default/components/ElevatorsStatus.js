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
import { MdCall, MdCallEnd, MdAddCall, MdOutlineSearch } from 'react-icons/md';

import DashboardHeader from './DashboardHeader';

import DashboardAllElevators from './DashboardAllElevators';
import DashboardDeactivatedElevators from './DashboardDeactivatedElevators';
import DashboardConnectedElevators from './DashboardConnectedElevators';
import DashboardDisconnectedElevators from './DashboardDisconnectedElevators';

const ElevatorsStatus = () => {
  const [elevatorCounts, setElevatorCounts] = useState({
    total: 0,
    disconnected: 0,
    connected: 0,
  });

  const [activeSection, setActiveSection] = useState('elevators'); // Track the current active section

  const handleSectionClick = (section) => {
    setActiveSection(section); // Update the active section on card click
  };

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
        gridTemplateColumns={{ base: '100%', md: '80% 20%' }} // Adjusts the grid layout for mobile
      >
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          spacing={4}
          mb={0}
          mr={0}
          ml={2}
        >
          {/* All Elevators Card */}
          <Box
            onClick={() => handleSectionClick('elevators')}
            cursor="pointer"
            bg={
              activeSection === 'elevators'
                ? 'linear-gradient(90deg, #2A2B2D, #011A4D)'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={6}
            height="90px"
            color={activeSection === 'elevators' ? '#A4BBF9' : '#0F405B'}
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
              <Text fontSize="sm">All Elevators</Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                {elevatorCounts.total}
              </Text>
            </Box>
          </Box>

          {/* Deactivated Elevators Card */}
          <Box
            onClick={() => handleSectionClick('dashboardDeactivatedElevators')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardDeactivatedElevators'
                ? 'linear-gradient(90deg, #2A2B2D,rgb(199, 48, 48))'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={6}
            height="90px"
            color={
              activeSection === 'dashboardDeactivatedElevators'
                ? '#A4BBF9'
                : '#0F405B'
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
              <Text fontSize="sm">Deactivated Elevators</Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                {elevatorCounts.disconnected}
              </Text>
            </Box>
          </Box>

          {/* Connected Elevators Card */}
          <Box
            onClick={() => handleSectionClick('dashboardConnectedElevators')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardConnectedElevators'
                ? 'linear-gradient(90deg, #7C2ECE, #2A2B2D)'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={6}
            height="90px"
            color={
              activeSection === 'dashboardConnectedElevators'
                ? '#A4BBF9'
                : '#0F405B'
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
                Connected Elevators
              </Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                {elevatorCounts.connected}
              </Text>
            </Box>
          </Box>

          {/* Disconnected Elevators*/}
          <Box
            onClick={() => handleSectionClick('dashboardDisconnectedElevators')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardDisconnectedElevators'
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
                  activeSection === 'dashboardDisconnectedElevators'
                    ? 'white'
                    : '#A3AED0'
                }
                style={{ fontSize: '14px' }}
              >
                Disconnected Elevators
              </Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                6
              </Text>
            </Box>
          </Box>
        </SimpleGrid>
      </SimpleGrid>

      {/* Display Component Based on Active Section */}
      {activeSection === 'elevators' && (
        <DashboardAllElevators setElevatorCounts={setElevatorCounts} />
      )}
      {activeSection === 'dashboardDeactivatedElevators' && (
        <DashboardDeactivatedElevators setElevatorCounts={setElevatorCounts} />
      )}
      {activeSection === 'dashboardConnectedElevators' && (
        <DashboardConnectedElevators setElevatorCounts={setElevatorCounts} />
      )}
      {activeSection === 'dashboardDisconnectedElevators' && (
        <DashboardDisconnectedElevators />
      )}
    </Box>
  );
};

export default ElevatorsStatus;
