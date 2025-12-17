import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Text, Button, Checkbox } from '@chakra-ui/react';
import config from 'config/config'; // Assuming config is exported correctly
import 'assets/css/Dashboard.css';

const DashboardAllElevators = ({ setElevatorCounts }) => {
  const titleHeighlited = '#0F405B';
  const titlecolor = '#A3AED0';

  const [elevators, setElevators] = useState([]);
  const [selectedElevator, setSelectedElevator] = useState(null);
  const [selectedLiftId, setSelectedLiftId] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedElevators, setSelectedElevators] = useState([]);

  useEffect(() => {
    fetchElevators();
  }, []);

  const fetchElevators = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/elevators/`);
      const data = await response.json();
      setElevators(data);

      const total = data.length;
      const connected = data.filter((e) => e.status === 'Active').length;
      const disconnected = data.filter(
        (e) => e.status === 'Deactivated',
      ).length;
      const deactivated = data.filter((e) => e.status === '').length;

      console.log('Elevator Count Summary:');
      console.log('Total:', total);
      console.log('Connected:', connected);
      console.log('Disconnected:', disconnected);
      console.log('Deactivated:', deactivated);

      if (setElevatorCounts) {
        setElevatorCounts({
          total,
          connected,
          disconnected,
          deactivated,
        });
      }

      if (data.length > 0) {
        setSelectedLiftId(data[0].id);
        setSelectedElevator(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch elevators:', error);
    }
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

  const YOUR_API_KEY = 'AIzaSyAhM450WINOm2X-J_ewxJxtwmuz_Hk_Wk0';

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
            All Elevators
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
                <li>
                  {deleteMode && (
                    <Checkbox
                      isChecked={selectedElevators.includes(elevator.id)}
                      onChange={() => handleCheckboxChange(elevator.id)}
                    />
                  )}
                </li>
                <li>{elevator.elevatorid}</li>
                <li
                  style={{
                    color: elevator.status === 'Active' ? 'green' : 'red',
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
              width="100%"
              height="200"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Google Maps"
              src={`https://www.google.com/maps/embed/v1/place?key=${YOUR_API_KEY}&q=${encodeURIComponent(
                `${selectedElevator?.city || ''}, ${
                  selectedElevator?.state || ''
                }, ${selectedElevator?.zip || ''}`,
              )}`}
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
              <Text mb={2}>
                <span style={{ fontSize: '14px', color: titlecolor }}>
                  Agent ID
                </span>
                <br />
                <span
                  style={{
                    fontSize: '18px',
                    color: titleHeighlited,
                    fontWeight: 'bold',
                  }}
                >
                  {selectedElevator?.agent?.unique_id}
                </span>
              </Text>
              <Text mb={2}>
                <span style={{ fontSize: '14px', color: titlecolor }}>
                  Agent Name
                </span>
                <br />
                <span
                  style={{
                    fontSize: '18px',
                    color: titleHeighlited,
                    fontWeight: 'bold',
                  }}
                >
                  {selectedElevator?.agent?.name}
                </span>
              </Text>
            </SimpleGrid>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </SimpleGrid>
  );
};

export default DashboardAllElevators;
