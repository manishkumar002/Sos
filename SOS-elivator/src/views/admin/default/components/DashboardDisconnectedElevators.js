import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Text, Button, Checkbox } from '@chakra-ui/react';
import config from 'config/config'; // Assuming config is exported correctly
import 'assets/css/Dashboard.css';

const DashboardDisconnectedElevators = () => {
  const titleHeighlited = '#0F405B';
  const titlecolor = '#A3AED0';

  const [elevators, setElevators] = useState([]);
  const [selectedElevator, setSelectedElevator] = useState(null);
  const [selectedLiftId, setSelectedLiftId] = useState(null);

  const [selectedElevators, setSelectedElevators] = useState([]);

  useEffect(() => {
    fetchElevators();
  }, []);

  const fetchElevators = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/elevators/`);
      const data = await response.json();
      setElevators(data);
      if (data.length > 0) {
        setSelectedLiftId(data[0].id);
        setSelectedElevator(data[0]);
      }
    } catch (error) {}
  };

  const handleRowClick = (elevator) => {
    setSelectedElevator(elevator);
    setSelectedLiftId(elevator.id);
  };

  const handleCheckboxChange = (id) => {
    setSelectedElevators((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id],
    );
  };

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2 }}
      spacing={4}
      textAlign="left"
      mb={0}
      ml={3}
      mr={-4}
    >
      {/* Elevator List Section */}
      <SimpleGrid columns={1} spacing={4}>
        <Box bg="white" boxShadow="md" borderRadius="lg" p={6} w="100%">
          <Text
            fontSize={{ base: '18px', md: '20px' }}
            mb={8}
            fontWeight="bold"
            color={titleHeighlited}
          >
            Disconnected Elevators
          </Text>

          <Box>
            <ul
              style={{
                display: 'grid',
                gridTemplateColumns: '8% 26% 25% 20% 20% 14%',
                fontWeight: 'bold',
                height: '40px',
              }}
            >
              <li></li>
              <li className="callsHeaderTitle">Lift ID</li>
              <li className="callsHeaderTitle">Status</li>
              <li className="callsHeaderTitle">City</li>
              <li className="callsHeaderTitle">Zip/Pin</li>
            </ul>

            {elevators.map((elevator, index) => (
              <ul
                key={elevator.id}
                onClick={() => handleRowClick(elevator)}
                className={
                  elevator.id === selectedLiftId
                    ? 'lift-row selected'
                    : 'lift-row'
                }
                style={{
                  display: 'grid',
                  gridTemplateColumns: '6% 25% 25% 25% 20% 14%',
                  cursor: 'pointer',
                }}
              >
                <li></li>
                <li>{elevator.elevatorid}</li>
                <li
                  style={{
                    color: elevator.status === 'Online' ? 'green' : 'red',
                  }}
                >
                  {elevator.status}
                </li>
                <li>{elevator.city}</li>
                <li>{elevator.zip}</li>
              </ul>
            ))}
          </Box>
        </Box>
      </SimpleGrid>

      {/* Elevator Info & Map Section */}
      <SimpleGrid columns={1} spacing={4} textAlign="center">
        <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
          <Box height="200px" borderRadius="lg" overflow="hidden" mb={4}>
            <iframe
              id="map-canvas"
              width="100%"
              height="200px"
              frameBorder="0"
              scrolling="no"
              src="https://maps.google.com/maps?width=100%&height=200&hl=en&q=&t=&z=14&ie=UTF8&iwloc=B&output=embed"
              title="Google Maps"
            />
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} textAlign="left">
            <SimpleGrid columns={1} spacing={4}>
              <Text mb={2}>
                <span style={{ fontSize: '14px', color: titlecolor }}>
                  Elevator ID
                </span>
                <br />
                <span
                  style={{
                    fontSize: '18px',
                    color: titleHeighlited,
                    fontWeight: 'bold',
                  }}
                >
                  {selectedElevator?.elevatorid || ''}
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
                  {selectedElevator?.city}, {selectedElevator?.state},{' '}
                  {selectedElevator?.zip}, United States
                </span>
              </Text>

              <Text mb={2}>
                <span style={{ fontSize: '14px', color: titlecolor }}>
                  Hospital
                </span>
                <br />
                <span
                  style={{
                    fontSize: '18px',
                    color: titleHeighlited,
                    fontWeight: 'bold',
                  }}
                >
                  {selectedElevator?.company}
                </span>
              </Text>

              <Text mb={2}>
                <span style={{ fontSize: '14px', color: titlecolor }}>
                  User
                </span>
                <br />
                <span
                  style={{
                    fontSize: '18px',
                    color: titleHeighlited,
                    fontWeight: 'bold',
                  }}
                >
                  {selectedElevator?.user}
                </span>
              </Text>
            </SimpleGrid>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </SimpleGrid>
  );
};

export default DashboardDisconnectedElevators;
