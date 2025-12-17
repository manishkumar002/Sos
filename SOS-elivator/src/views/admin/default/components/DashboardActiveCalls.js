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
// import DashboardPage from './DashboardPage';
// import DashboardActiveCallBar from './DashboardActiveCallBar';

const DashboardActiveCalls = ({
  setCallsCounts,
  elevatorId,
  agentId,
  searchTriggered,
}) => {
  const titleHeighlited = '#0F405B';
  const titlecolor = '#A3AED0';

  // State to store the selected Lift ID
  const [selectedLiftId, setSelectedLiftId] = useState(null);
  const [activeCalls, setActiveCalls] = useState([]);

  // Data for the bar chart
  // const [weekGraph,setWeekGraph]=useState([])
  // const fetchLast7DaysActiveCallCount = async () => {
  //   try {
  //     const response = await fetch(`${config.SOS_elivator}/getLast7DaysActiveCount`);
  //     const result = await response.json();
  //     setWeekGraph(result)
  //     console.log(result,"result")
  //   } catch (error) {
  //   }
  // };

  // useEffect(() => {
  //   fetchLast7DaysActiveCallCount();
  // }, []);

  const handleRowClick = (liftId) => {
    setSelectedLiftId(liftId);
  };

  useEffect(() => {
    fetchCallCounts();
    fetchFinishedCall();
  }, []);

  useEffect(() => {
    if (searchTriggered) {
      fetchFinishedCall();
    }
  }, [searchTriggered]);

  const fetchCallCounts = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/callLists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Empty filters
      });

      const result = await response.json();
      const data = result.callLists || [];

      const activeCount = data.filter(
        (call) => call.call_status?.trim().toLowerCase() === 'active',
      ).length;
      const finishedCount = data.filter(
        (call) => call.call_status?.trim().toLowerCase() === 'finished',
      ).length;
      const waitingCount = data.filter(
        (call) => call.call_status?.trim().toLowerCase() === 'waiting',
      ).length;

      if (setCallsCounts) {
        setCallsCounts({
          activeCount,
          finishedCount,
          waitingCount,
        });
      }
    } catch (error) {
      console.error('Failed to fetch call counts:', error);
    }
  };

  const fetchFinishedCall = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/callLists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, elevatorId }),
      });

      const result = await response.json();
      const data = result.callLists || [];

      const filtered = data.filter(
        (call) => call.call_status?.trim().toLowerCase() === 'active',
      );
      setActiveCalls(filtered);

      if (filtered.length > 0) {
        setSelectedLiftId(filtered[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch filtered calls:', error);
    }
  };

  const selectedCall = activeCalls.find((call) => call.id === selectedLiftId);
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
            Active Calls
          </Text>

          <Box>
            {/* <DashboardPage onSearch={handleSearch} /> */}
            {/* Header Row */}
            <ul
              className="callsHeaderTitle"
              style={{
                display: 'grid',
                gridTemplateColumns: '20% 20% 20% 20% 10%',
                fontWeight: 'bold',
                paddingLeft: 0,
                height: '40px',
              }}
            >
              <li className="callsHeaderTitle">Lift ID</li>
              <li className="callsHeaderTitle">Call Status</li>
              <li className="callsHeaderTitle">Agent Name</li>
              <li className="callsHeaderTitle">Agent ID</li>
              <li className="callsHeaderTitle">Call Time</li>
            </ul>

            {/* Body Rows */}
            {activeCalls.map((call, index) => {
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
                    gridTemplateColumns: '23% 17% 20% 20% 40%',
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
                  <li
                    style={{
                      paddingLeft: 0,
                      textAlign: 'left',
                      color: 'green',
                    }}
                  >
                    {call?.agent_id}
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
            {weekGraph.totalCount}
           
            {' '}
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

          <DashboardActiveCallBar   weekGraph={weekGraph}/>
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

export default DashboardActiveCalls;
