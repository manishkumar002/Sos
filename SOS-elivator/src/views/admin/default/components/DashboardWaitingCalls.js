import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Text, Image } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import gmapImg from 'assets/img/gmap.png';
import config from 'config/config';
import 'assets/css/Dashboard.css';
// import DashboardActiveCallBar from './DashboardActiveCallBar';

const DashboardWaitingCalls = () => {
  const titleHeighlited = '#0F405B';
  const titlecolor = '#A3AED0';

  // State to store the selected Lift ID
  const [selectedLiftId, setSelectedLiftId] = useState(null);
  const [waitingCalls, setWaitingCalls] = useState([]);
  // Waiting Calls

  const handleRowClick = (liftId) => {
    setSelectedLiftId(liftId);
  };

  useEffect(() => {
    fetchWaitingCall();
  }, []);

  const fetchWaitingCall = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/callLists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Add filtering data if needed (e.g., { agentId: 1 })
      });

      const result = await response.json();
      const data = result.callLists || [];

      const filtered = data.filter(
        (call) => call.call_status?.trim().toLowerCase() === 'waiting',
      );

      setWaitingCalls(filtered);

      if (filtered.length > 0) {
        setSelectedLiftId(filtered[0].id); // Select first waiting call by default
      }
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    }
  };

  console.log(waitingCalls, 'waitingCalls');

  const selectedCall = waitingCalls.find((call) => call.id === selectedLiftId);
  const YOUR_API_KEY = 'AIzaSyAhM450WINOm2X-J_ewxJxtwmuz_Hk_Wk0';

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2 }} // Responsive columns
      spacing={4}
      textAlign="left"
      mb={0}
      ml={3}
      mr={-4}
    >
      <SimpleGrid columns={1} spacing={4} textAlign="left">
        <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={0} w="100%">
          <Text
            fontSize={{ base: '18px', md: '20px' }}
            mb={8}
            fontWeight="bold"
            color={titleHeighlited}
          >
            Waiting Calls
          </Text>

          <Box>
            {/* Header Row */}
            <ul
              className="callsHeaderTitle"
              style={{
                display: 'grid',
                gridTemplateColumns: '30% 25% 25% 20%',
                fontWeight: 'bold',
                paddingLeft: 0,
                height: '40px',
              }}
            >
              <li className="callsHeaderTitle">Lift ID</li>
              <li className="callsHeaderTitle">Call Status</li>
              <li className="callsHeaderTitle">Agent Name</li>
              <li className="callsHeaderTitle">Call Time</li>
            </ul>

            {/* Body Rows */}
            {waitingCalls.map((call, index) => {
              const isSelected = call.id === selectedLiftId;
              const timeIST = new Date(call.timestamp).toLocaleTimeString(
                'en-IN',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                  timeZone: 'Asia/Kolkata',
                },
              );
              // Check if the row is selected

              return (
                <ul
                  key={index}
                  onClick={() => handleRowClick(call.id)}
                  className={`lift-row ${isSelected ? 'selected' : ''}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '30% 25% 25% 20%',
                    cursor: 'pointer',
                  }}
                >
                  <li style={{ paddingLeft: 0, textAlign: 'left' }}>
                    {call?.lift_id}
                  </li>
                  <li
                    style={{
                      paddingLeft: 0,
                      textAlign: 'left',
                      color: 'green',
                    }}
                  >
                    {call?.call_status}
                  </li>
                  <li style={{ paddingLeft: 0, textAlign: 'left' }}>
                    {call?.agent?.name}
                  </li>
                  <li style={{ paddingLeft: 0, textAlign: 'left' }}>
                    {timeIST}
                  </li>
                </ul>
              );
            })}
          </Box>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={1} spacing={4} textAlign="center">
        {/* <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={0}>
          <Text
            mb={4}
            color={titlecolor}
            fontSize={{ base: '12px', md: '14px' }}
            align={'left'}
          >
            Calls in Last 7 Days
          </Text>
          <Text
            fontSize={{ base: '18px', md: '20px' }}
            mb={4}
            color={titleHeighlited}
            fontWeight="bold"
            align={'left'}
          >
            1320{' '}
            <Text
              as="span"
              color={titlecolor}
              fontSize={{ base: '12px', md: '14px' }}
              fontWeight="normal"
            >
              {' '}
              Calls{' '}
            </Text>
          </Text>

          <DashboardActiveCallBar />
        </Box> */}

        <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={4}
            textAlign="center"
          >
            <SimpleGrid columns={1} spacing={4} textAlign="left">
              <Text mb={2}>
                <span style={{ fontSize: '14px', color: titlecolor }}>
                  Elevator ID
                </span>
                <br />
                {/* Display the selected Lift ID */}
                <span
                  style={{
                    fontSize: '18px',
                    color: titleHeighlited,
                    fontWeight: 'bold',
                  }}
                  className="callsTitleValue"
                >
                  {selectedCall?.lift_id}
                </span>
              </Text>

              <Text mb={2}>
                <span style={{ fontSize: '14px', color: titlecolor }}>
                  SOS Elevator Address
                </span>
                <br />
                <span
                  style={{
                    fontSize: '18px',
                    color: titleHeighlited,
                    fontWeight: 'bold',
                  }}
                >
                  {selectedCall?.address}
                </span>
              </Text>
            </SimpleGrid>
            <SimpleGrid columns={1} spacing={4} textAlign="center">
              <Box height="200px" borderRadius="lg" overflow="hidden">
                <iframe
                  width="100%"
                  height="200"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Google Maps"
                  src={`https://www.google.com/maps/embed/v1/place?key=${YOUR_API_KEY}&q=${encodeURIComponent(
                    selectedCall?.address,
                  )}`}
                />
              </Box>
            </SimpleGrid>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </SimpleGrid>
  );
};

export default DashboardWaitingCalls;
