// import React, { useState, useEffect } from 'react';
// import { Box, SimpleGrid, Text, Image } from '@chakra-ui/react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import gmapImg from 'assets/img/gmap.png';
// import 'assets/css/Dashboard.css';

// const DashboardFinishedCalls = () => {
//   const titleHeighlited = '#0F405B';
//   const titlecolor = '#A3AED0';
//   const [selectedLiftId, setSelectedLiftId] = useState('LIFTID10101011987');

//   const data = [
//     { calls: 90 },
//     { calls: 190 },
//     { calls: 50 },
//     { calls: 10 },
//     { calls: 410 },
//     { calls: 70 },
//     { calls: 10 },
//   ];

//   const handleRowClick = (liftId) => {
//     setSelectedLiftId(liftId);
//   };

//   const liftIds = Array.from({ length: 10 }).map(
//     (_, index) => `LIFTID${10101011987 + index}`,
//   );

//   useEffect(() => {
//     if (!selectedLiftId) {
//       setSelectedLiftId(liftIds[0]);
//     }
//   }, [liftIds, selectedLiftId]);

//   return (
//     <SimpleGrid
//       columns={{ base: 1, md: 2 }} // Responsive columns
//       spacing={4}
//       textAlign="left"
//       mb={0}
//       ml={3}
//       mr={-4}
//     >
//       <SimpleGrid columns={1} spacing={4} textAlign="left">
//         <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={0}>
//           <Text
//             fontSize={{ base: '18px', md: '20px' }}
//             mb={8}
//             fontWeight="bold"
//             color={titleHeighlited}
//           >
//             Finished Calls
//           </Text>

//           <Box>
//             <ul
//               style={{
//                 display: 'grid',
//                 gridTemplateColumns: '30% 25% 25% 20%',
//                 fontWeight: 'bold',
//                 paddingLeft: 0,
//                 height: '40px',
//               }}
//             >
//               <li style={{ paddingLeft: 0, textAlign: 'left' }}>Elevator ID</li>
//               <li style={{ paddingLeft: 0, textAlign: 'left' }}>Call Status</li>
//               <li style={{ paddingLeft: 0, textAlign: 'left' }}>Agent Name</li>
//               <li style={{ paddingLeft: 0, textAlign: 'left' }}>Call Time</li>
//             </ul>

//             {liftIds.map((liftId, index) => {
//               const isSelected = liftId === selectedLiftId;

//               return (
//                 <ul
//                   key={index}
//                   onClick={() => handleRowClick(liftId)}
//                   className={`lift-row ${isSelected ? 'selected' : ''}`}
//                   style={{
//                     cursor: 'pointer',
//                     gridTemplateColumns: '30% 25% 25% 20%',
//                   }} // Add cursor style for better UX
//                 >
//                   <li style={{ paddingLeft: 0, textAlign: 'left' }}>
//                     {liftId}
//                   </li>
//                   <li
//                     style={{ paddingLeft: 0, textAlign: 'left', color: 'red' }}
//                   >
//                     Finished
//                   </li>
//                   <li style={{ paddingLeft: 0, textAlign: 'left' }}>
//                     David Carlo
//                   </li>
//                   <li style={{ paddingLeft: 0, textAlign: 'left' }}>
//                     19:45 PM
//                   </li>
//                 </ul>
//               );
//             })}
//           </Box>
//         </Box>
//       </SimpleGrid>

//       <SimpleGrid columns={1} spacing={4} textAlign="center">
//         <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
//           <Text mb={4} color={titlecolor} fontSize="14px" align={'left'}>
//             Calls in Last 7 Days
//           </Text>
//           <Text
//             fontSize={{ base: '16px', md: '20px' }}
//             mb={4}
//             color={titleHeighlited}
//             fontWeight="bold"
//             align={'left'}
//           >
//             20{' '}
//             <Text
//               as="span"
//               color={titlecolor}
//               fontSize="14px"
//               fontWeight="normal"
//             >
//               {' '}
//               Calls{' '}
//             </Text>
//           </Text>

//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={data}>
//               <defs>
//                 <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="#11C078" stopOpacity={0.8} />
//                   <stop offset="100%" stopColor="#B7D5FD" stopOpacity={0.8} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="0 1" />
//               <XAxis dataKey="calls" axisLine={false} tickLine={false} />
//               <Tooltip />
//               <Bar
//                 dataKey="calls"
//                 fill="url(#gradientColor)"
//                 barSize={22}
//                 radius={[10, 10, 0, 0]}
//                 className="bar_graph_speed"
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </Box>

//         <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
//           <SimpleGrid
//             columns={{ base: 1, md: 2 }}
//             spacing={2}
//             textAlign="center"
//           >
//             <SimpleGrid columns={1} spacing={4} textAlign="left">
//               <Text mb={2}>
//                 <span style={{ fontSize: '14px', color: titlecolor }}>
//                   Elevator ID
//                 </span>
//                 <br />
//                 <span
//                   style={{
//                     fontSize: '18px',
//                     color: titleHeighlited,
//                     fontWeight: 'bold',
//                   }}
//                 >
//                   {selectedLiftId}
//                 </span>
//               </Text>

//               <Text mb={2}>
//                 <span style={{ fontSize: '14px', color: titlecolor }}>
//                   SOS Elevator Address
//                 </span>
//                 <br />
//                 <span
//                   style={{
//                     fontSize: '18px',
//                     color: titleHeighlited,
//                     fontWeight: 'bold',
//                   }}
//                 >
//                   1800 Orleans St, Baltimore, MD, 21287, United States
//                 </span>
//               </Text>
//             </SimpleGrid>
//             <SimpleGrid columns={1} spacing={4} textAlign="center">
//               <Box height="200px" borderRadius="lg" overflow="hidden">
//                 <Image
//                   src={gmapImg}
//                   alt="Map"
//                   objectFit="cover"
//                   width="100%"
//                   height="100%"
//                 />
//               </Box>
//             </SimpleGrid>
//           </SimpleGrid>
//         </Box>
//       </SimpleGrid>
//     </SimpleGrid>
//   );
// };

// export default DashboardFinishedCalls;

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
import DashboardActiveCallBar from './DashboardActiveCallBar';

const DashboardFinishedCalls = ({ elevatorId, agentId, searchTriggered }) => {
  const titleHeighlited = '#0F405B';
  const titlecolor = '#A3AED0';

  // State to store the selected Lift ID
  const [selectedLiftId, setSelectedLiftId] = useState(null);
  const [finishedCalls, setFinishedCalls] = useState([]);

  // Data for the bar chart
  const [weekGraph, setWeekGraph] = useState([]);
  const fetchLast7DaysFinishedCallCount = async () => {
    try {
      const response = await fetch(
        `${config.SOS_elivator}/getLast7DaysFinishedCount`,
      );
      const result = await response.json();
      setWeekGraph(result);
      console.log(result, 'result');
    } catch (error) {}
  };

  useEffect(() => {
    fetchLast7DaysFinishedCallCount();
  }, []);

  const handleRowClick = (liftId) => {
    setSelectedLiftId(liftId);
  };

  useEffect(() => {
    fetchFinishedCall();
  }, []);

  useEffect(() => {
    if (searchTriggered) {
      fetchFinishedCall();
    }
  }, [searchTriggered]);

  const fetchFinishedCall = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/callLists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ elevatorId, agentId }), // Yahan agentId/elevatorId bhejna ho to object me pass karo
      });

      const result = await response.json();
      const data = result.callLists || [];

      const filtered = data.filter(
        (call) => call.call_status?.trim().toLowerCase() === 'finished',
      );

      setFinishedCalls(filtered);

      if (filtered.length > 0) {
        setSelectedLiftId(filtered[0].id); // Select first finished call by default
      }
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    }
  };

  const selectedCall = finishedCalls.find((call) => call.id === selectedLiftId);
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
            Finished Calls
          </Text>

          <Box>
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
            {finishedCalls.map((call, index) => {
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
        <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={0}>
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
            {weekGraph.totalCount}{' '}
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

          <DashboardActiveCallBar weekGraph={weekGraph} />
        </Box>

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

export default DashboardFinishedCalls;
