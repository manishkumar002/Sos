import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Text, Icon } from '@chakra-ui/react';
import { MdCall, MdCallEnd, MdAddCall } from 'react-icons/md';
import config from 'config/config';
import DashboardHeader from './DashboardHeader';

import DashboardReportsFinishedCalls from './DashboardReportsFinishedCalls';
import DashboardReportsMissedCalls from './DashboardReportMissedCalls';
import DashboardReportTaskAssigned from './DashboardReportTaskAssigned';
import DashboardReportMonitoringAgent from './DashboardReportMonitoringAgent';
import DashboardReportUsers from './DashboardReportUsers';
import DashboardReportsTechnicians from './DashboardReportsTechnicians';
const Reports = () => {
  const [activeSection, setActiveSection] = useState(
    'dashboardReportsFinishedCalls',
  );

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const [counts, setCounts] = useState({ missedCount: 0, finishedCount: 0 });
  const [agentCount, setAgentCount] = useState([]);
  const [userCount, setUserCount] = useState([]);
  const [techniciansCount, setTechniciansCount] = useState([]);
  const [assignedCount, setAssignedCount] = useState([]);

  //missed and finished count
  const fetchCallCounts = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/callLists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // 👈 If you have filters like agentId/elevatorId, pass them here
      });

      const result = await response.json();

      const data = result.callLists || [];

      const missedCalls = data.filter(
        (calls) => calls.call_status?.trim().toLowerCase() === 'missed',
      );
      const finishedCalls = data.filter(
        (calls) => calls.call_status?.trim().toLowerCase() === 'finished',
      );

      return {
        missedCount: missedCalls.length,
        finishedCount: finishedCalls.length,
      };
    } catch (error) {
      console.error('Failed to fetch call counts:', error);
      return {
        missedCount: 0,
        finishedCount: 0,
      };
    }
  };

  useEffect(() => {
    const getCounts = async () => {
      const countData = await fetchCallCounts();
      setCounts(countData);
    };

    getCounts();
  }, []);

  // agentCount

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${config.SOS_elivator}/allAgent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // Agar aapko koi filter nahi bhejna toh empty object
        });

        const report = await response.json();
        setAgentCount(report.length);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

  //Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${config.SOS_elivator}/allUsers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        const report = await response.json();
        setUserCount(report.length);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  //Technicians Count
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${config.SOS_elivator}/getAllTechniciansForAdmin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          },
        );

        const report = await response.json();
        setTechniciansCount(Array.isArray(report) ? report.length : 0);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchUsers();
  }, []);

  //TaskAssignedList  Count
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${config.SOS_elivator}/taskAssignedList`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          },
        );

        const report = await response.json();
        const data = report.taskAssigned || [];
        setAssignedCount(data.length);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchUsers();
  }, []);

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
      <DashboardHeader pageName="Reports" />

      <SimpleGrid
        columns={{ base: 1, md: 2 }} // Makes grid 1 column on mobile, 2 columns on larger screens
        mt={{ base: -10, md: -40 }} // Adjust margin-top for mobile and larger screens
        spacing={4}
        mb={4}
        mr={-4}
        gridTemplateColumns={{ base: '100%', md: '100%' }} // Adjusts the grid layout for mobile
      >
        <SimpleGrid
          columns={{ base: 1, sm: 3, md: 6 }}
          spacing={4}
          mb={0}
          mr={0}
          ml={2}
        >
          {/* Finished Calls Report */}
          <Box
            onClick={() => handleSectionClick('dashboardReportsFinishedCalls')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardReportsFinishedCalls'
                ? 'linear-gradient(90deg,rgb(0, 0, 0),rgb(79, 128, 97))'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={6}
            height="90px"
            color={
              activeSection === 'dashboardReportsFinishedCalls'
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
              <Text fontSize="sm">Finished Calls</Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                {counts.finishedCount}
              </Text>
            </Box>
          </Box>

          {/* Missed Calls Report */}
          <Box
            onClick={() => handleSectionClick('dashboardReportsMissedCalls')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardReportsMissedCalls'
                ? 'linear-gradient(90deg, #7C2ECE, #2A2B2D)'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={6}
            height="90px"
            color={
              activeSection === 'dashboardReportsMissedCalls'
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
                  activeSection === 'dashboardReportsMissedCalls'
                    ? 'white'
                    : '#A3AED0'
                }
                style={{ fontSize: '14px' }}
              >
                Missed Calls
              </Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                {counts.missedCount}
              </Text>
            </Box>
          </Box>

          {/*Task Assigned Report*/}
          <Box
            onClick={() => handleSectionClick('dashboardReportTaskAssigned')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardReportTaskAssigned'
                ? 'linear-gradient(90deg, #6DBE45,rgb(45, 98, 205))'
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
                  activeSection === 'dashboardReportTaskAssigned'
                    ? 'white'
                    : '#A3AED0'
                }
                style={{ fontSize: '14px' }}
              >
                Task Assigned
              </Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                {assignedCount}
              </Text>
            </Box>
          </Box>

          {/* Monitoring Agents Reports*/}
          <Box
            onClick={() => handleSectionClick('dashboardReportMonitoringAgent')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardReportMonitoringAgent'
                ? 'linear-gradient(90deg,rgb(16, 105, 132),rgb(172, 123, 157))'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={4}
            height="90px"
            color={
              activeSection === 'dashboardReportMonitoringAgent'
                ? '#A4BBF9'
                : '#0F405B'
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
                  activeSection === 'dashboardReportMonitoringAgent'
                    ? 'white'
                    : '#A3AED0'
                }
                style={{ fontSize: '14px' }}
              >
                Monitoring Agents
              </Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                {agentCount}
              </Text>
            </Box>
          </Box>

          {/* User Report*/}
          <Box
            onClick={() => handleSectionClick('dashboardReportUsers')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardReportUsers'
                ? 'linear-gradient(90deg,rgb(150, 25, 50),rgb(69, 101, 167))'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={4}
            height="90px"
            color={
              activeSection === 'dashboardReportUsers' ? '#A4BBF9' : '#0F405B'
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
                  activeSection === 'dashboardReportUsers' ? 'white' : '#A3AED0'
                }
                style={{ fontSize: '14px' }}
              >
                Users
              </Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                {userCount}
              </Text>
            </Box>
          </Box>

          {/* Technicians Report */}
          <Box
            onClick={() => handleSectionClick('dashboardReportsTechnicians')}
            cursor="pointer"
            bg={
              activeSection === 'dashboardReportsTechnicians'
                ? 'linear-gradient(90deg,rgb(35, 97, 219),rgb(40, 77, 1))'
                : 'white'
            }
            boxShadow="md"
            borderRadius="20px"
            p={6}
            height="90px"
            color={
              activeSection === 'dashboardReportsTechnicians'
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
              <Text fontSize="sm">Technicians</Text>
              <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                {techniciansCount}
              </Text>
            </Box>
          </Box>
        </SimpleGrid>
      </SimpleGrid>

      {/* Display Component Based on Active Section */}
      {activeSection === 'dashboardReportsFinishedCalls' && (
        <DashboardReportsFinishedCalls />
      )}
      {activeSection === 'dashboardReportsMissedCalls' && (
        <DashboardReportsMissedCalls />
      )}
      {activeSection === 'dashboardReportTaskAssigned' && (
        <DashboardReportTaskAssigned />
      )}
      {activeSection === 'dashboardReportMonitoringAgent' && (
        <DashboardReportMonitoringAgent />
      )}
      {activeSection === 'dashboardReportUsers' && <DashboardReportUsers />}
      {activeSection === 'dashboardReportsTechnicians' && (
        <DashboardReportsTechnicians />
      )}
    </Box>
  );
};

export default Reports;
