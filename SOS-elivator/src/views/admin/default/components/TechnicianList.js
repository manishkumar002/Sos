import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Text, Image } from '@chakra-ui/react';
import noimg from 'assets/img/noimg.png';
import DashboardHeader from './DashboardHeader';
import config from 'config/config';

const TechnicianList = () => {
  const [selectedLiftId, setSelectedLiftId] = useState(null);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const response = await fetch(
        `${config.SOS_elivator}/getAllTechniciansForAdmin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTechnicians(data);
      if (data.length > 0) {
        setSelectedLiftId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleRowClick = (liftId) => {
    setSelectedLiftId(liftId);
  };

  const selectedTechnician = technicians.find(
    (technician) => technician.id === selectedLiftId,
  );

  return (
    <Box mt={-7} ml={-5} p={0} mr={0} bg="#eef2f6" minH="100vh">
      <DashboardHeader pageName="Technician List" />
      <SimpleGrid
        gridTemplateColumns="60% 39%"
        spacing={4}
        mt={-40}
        mb={0}
        mr={-4}
        ml={2}
        textAlign="left"
        id="leftUserShowList"
      >
        <Box
          bg="white"
          boxShadow="md"
          borderRadius="lg"
          p={6}
          marginBottom="7"
          w="100%"
        >
          <ul
            style={{
              display: 'grid',
              gridTemplateColumns: '33% 33% 33%',
              fontWeight: 'bold',
              height: '40px',
              marginLeft: '-12px',
              paddingLeft: '12px',
              paddingTop: '6px',
            }}
          >
            <li className="callsHeaderTitle">Technician Name</li>
            <li className="callsHeaderTitle">Status</li>
            <li className="callsHeaderTitle">ID</li>
          </ul>

          {technicians.map((technician) => {
            const isSelected = technician.id === selectedLiftId;
            return (
              <ul
                key={technician.id}
                onClick={() => handleRowClick(technician.id)}
                className={`lift-row ${isSelected ? 'selected' : ''}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '33% 33% 33%',
                  cursor: 'pointer',
                  height: '50px',
                }}
              >
                <li
                  style={{
                    paddingLeft: 0,
                    textAlign: 'left',
                    paddingTop: '3px',
                  }}
                >
                  {technician.name}
                </li>
                <li
                  style={{
                    paddingLeft: 0,
                    textAlign: 'left',
                    paddingTop: '3px',
                  }}
                >
                  <Text
                    fontWeight="bold"
                    color={
                      technician.status === 'active' ? 'green.500' : 'red.500'
                    }
                  >
                    {technician.status}
                  </Text>
                </li>
                <li
                  style={{
                    paddingLeft: 0,
                    textAlign: 'left',
                    paddingTop: '3px',
                  }}
                >
                  {technician.techunique_id}
                </li>
              </ul>
            );
          })}
        </Box>

        <SimpleGrid columns={1} spacing={4} mb={0}>
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={4}>
            {selectedTechnician && (
              <>
                <Text
                  className="callsHeaderTitle"
                  fontSize="lg"
                  mb={4}
                  fontWeight="bold"
                  width="100%"
                  mt="20px"
                  pl="10px"
                >
                  Technician Details
                </Text>
                <Image
                  src={noimg}
                  objectFit="cover"
                  width="100%"
                  height="200px"
                />
                <Text fontSize="lg" mb={4} fontWeight="bold">
                  <span
                    className="callsHeaderTitle"
                    style={{ fontSize: '16px' }}
                  >
                    Address:
                  </span>
                  <br />
                  <span
                    className="callsTitleValue"
                    style={{ fontSize: '14px', fontWeight: 'bold' }}
                  >
                    {selectedTechnician.location},{selectedTechnician.zip}
                  </span>
                  <br />
                  <br />
                  <span
                    className="callsHeaderTitle"
                    style={{ fontSize: '16px' }}
                  >
                    Email:
                  </span>
                  <br />
                  <span
                    className="callsTitleValue"
                    style={{ fontSize: '14px', fontWeight: 'bold' }}
                  >
                    {selectedTechnician.email}
                  </span>
                  <br />
                  <span
                    className="callsHeaderTitle"
                    style={{ fontSize: '16px' }}
                  >
                    Phone No:
                  </span>
                  <br />
                  <span
                    className="callsTitleValue"
                    style={{ fontSize: '14px', fontWeight: 'bold' }}
                  >
                    {selectedTechnician.phone}
                  </span>
                </Text>
              </>
            )}
          </Box>
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
};

export default TechnicianList;
