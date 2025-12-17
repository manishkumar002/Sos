import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Image,
  Select,
  Button,
  Input,
  FormControl,
  Checkbox,
} from '@chakra-ui/react';
import axios from 'axios';
import noimg from 'assets/img/noimg.png';
import DashboardHeader from './DashboardHeader';
import config from 'config/config';
const ManageTechnician = () => {
  const [selectedLiftId, setSelectedLiftId] = useState(null);
  const [isAddingTechnician, setIsAddingTechnician] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTechnicianId, setEditingTechnicianId] = useState(null);
  const [isRemovingTechnician, setIsRemovingTechnician] = useState(false);
  const agentId = localStorage.getItem('agentId');
  const [newTechnician, setNewTechnician] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    status: '',
    zip: '',
  });
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechniciansToRemove, setSelectedTechniciansToRemove] =
    useState([]);
  const apiUrl = `${config.SOS_elivator}/technicians`;
  useEffect(() => {
    fetchTechnicians();
  }, []);

  // Fetch technicians from the API using fetch and POST
  const fetchTechnicians = async () => {
    try {
      const agent_id = localStorage.getItem('agentId');
      const response = await fetch(`${config.SOS_elivator}/allTechnicians`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agent_id }),
      });

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

  const handleAddTechnicianClick = () => {
    setIsAddingTechnician(true);
    setIsEditing(false);
    setNewTechnician({
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      zip: '',
      status: '',
      techunique_id: '',
      agent_id: '',
    });
  };

  const handleCancelAddTechnician = () => setIsAddingTechnician(false);

  const handleEditTechnicianClick = (technicianId) => {
    const technicianToEdit = technicians.find(
      (technician) => technician.id === technicianId,
    );
    if (technicianToEdit) {
      setIsAddingTechnician(true);
      setIsEditing(true);
      setEditingTechnicianId(technicianId);
      setNewTechnician({
        name: technicianToEdit.name,
        email: technicianToEdit.email,
        phone: technicianToEdit.phone,
        city: technicianToEdit.city,
        state: technicianToEdit.state,
        status: technicianToEdit.status,
        zip: technicianToEdit.zip,
      });
    }
  };

  const handleRemoveTechnicianClick = () => setIsRemovingTechnician(true);

  const handleSaveTechnician = async () => {
    const generateUniqueId = () => {
      const randomFiveDigit = Math.floor(10000 + Math.random() * 90000);
      return `ID${randomFiveDigit}`;
    };
    const uniqueId = generateUniqueId();

    const technicianData = {
      techunique_id: uniqueId,
      agent_id: agentId,
      name: newTechnician.name,
      email: newTechnician.email,
      phone: newTechnician.phone,
      city: newTechnician.city,
      state: newTechnician.state,
      status: newTechnician.status,
      zip: newTechnician.zip,
      location: `${newTechnician.city}, ${newTechnician.state}`,
    };

    if (isEditing && editingTechnicianId) {
      // Update existing technician
      try {
        await axios.put(`${apiUrl}/${editingTechnicianId}`, technicianData);
        fetchTechnicians(); // Re-fetch technicians
      } catch (error) {
        console.error('Error updating technician:', error);
      }
    } else {
      try {
        await axios.post(apiUrl, technicianData);
        console.log('Generated ID:', uniqueId);
        fetchTechnicians();
      } catch (error) {
        console.error('Error adding technician:', error);
      }
    }

    setIsAddingTechnician(false);
    setNewTechnician({
      name: '',
      email: '',
      phone: '',
      city: '',
      status: '',
      state: '',
      zip: '',
    });
  };

  const handleCheckboxChange = (technicianId) => {
    if (selectedTechniciansToRemove.includes(technicianId)) {
      setSelectedTechniciansToRemove(
        selectedTechniciansToRemove.filter((id) => id !== technicianId),
      );
    } else {
      setSelectedTechniciansToRemove([
        ...selectedTechniciansToRemove,
        technicianId,
      ]);
    }
  };

  const handleConfirmRemove = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to remove the selected technicians?',
    );
    if (confirmed) {
      try {
        for (const technicianId of selectedTechniciansToRemove) {
          await axios.delete(`${apiUrl}/${technicianId}`);
        }
        fetchTechnicians(); // Re-fetch technicians after deletion
        setIsRemovingTechnician(false);
        setSelectedTechniciansToRemove([]);
      } catch (error) {
        console.error('Error removing technicians:', error);
      }
    }
  };

  const handleCancelRemove = () => {
    setIsRemovingTechnician(false);
    setSelectedTechniciansToRemove([]);
  };

  const selectedTechnician = technicians.find(
    (technician) => technician.id === selectedLiftId,
  );

  return (
    <Box mt={-7} ml={-5} p={0} mr={0} bg="#eef2f6" minH="100vh">
      <DashboardHeader pageName="Manage Technician" />
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
              gridTemplateColumns: '24% 24% 24% 24%',
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
            <li className="callsHeaderTitle">Action</li>
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
                  gridTemplateColumns: '24% 24% 24% 24%',
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
                <li
                  style={{
                    paddingLeft: 0,
                    textAlign: 'left',
                    paddingTop: '3px',
                  }}
                >
                  <Button
                    color="#ffffff"
                    bg="#632EEE"
                    height="30px"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTechnicianClick(technician.id);
                    }}
                  >
                    Edit
                  </Button>
                </li>
              </ul>
            );
          })}
        </Box>

        <SimpleGrid columns={1} spacing={4} mb={0}>
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={4}>
            {!isRemovingTechnician ? (
              <>
                <Button
                  bg="#682EF3"
                  color="#ffffff"
                  marginRight="10px"
                  onClick={handleAddTechnicianClick}
                >
                  Add Technician
                </Button>
                <Button
                  bg="#F13130"
                  color="#ffffff"
                  onClick={handleRemoveTechnicianClick}
                >
                  Remove Technician
                </Button>
              </>
            ) : (
              <>
                <Button
                  bg="#F13130"
                  color="#ffffff"
                  marginRight="10px"
                  onClick={handleConfirmRemove}
                >
                  Confirm
                </Button>
                <Button
                  bg="#682EF3"
                  color="#ffffff"
                  onClick={handleCancelRemove}
                >
                  Cancel
                </Button>
              </>
            )}

            <SimpleGrid
              columns={1}
              spacing={0}
              mb={0}
              id="addTechnicianRemoveTechnician"
            >
              {!isAddingTechnician && !isRemovingTechnician ? (
                <>
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
                </>
              ) : isAddingTechnician ? (
                <SimpleGrid columns={1}>
                  <Text
                    className="callsHeaderTitle"
                    fontSize="lg"
                    mb={4}
                    fontWeight="bold"
                    width="100%"
                    mt="20px"
                    pl="10px"
                  >
                    {isEditing ? 'Edit Technician' : 'Add New Technician'}
                  </Text>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Name"
                      value={newTechnician.name}
                      onChange={(e) =>
                        setNewTechnician({
                          ...newTechnician,
                          name: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Email"
                      value={newTechnician.email}
                      onChange={(e) =>
                        setNewTechnician({
                          ...newTechnician,
                          email: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Phone"
                      value={newTechnician.phone}
                      onChange={(e) =>
                        setNewTechnician({
                          ...newTechnician,
                          phone: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="City"
                      value={newTechnician.city}
                      onChange={(e) =>
                        setNewTechnician({
                          ...newTechnician,
                          city: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="State"
                      value={newTechnician.state}
                      onChange={(e) =>
                        setNewTechnician({
                          ...newTechnician,
                          state: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Zip"
                      value={newTechnician.zip}
                      onChange={(e) =>
                        setNewTechnician({
                          ...newTechnician,
                          zip: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <Select
                    name="status"
                    value={newTechnician.status}
                    onChange={(e) =>
                      setNewTechnician({
                        ...newTechnician,
                        status: e.target.value,
                      })
                    }
                    mt={3}
                  >
                    <option>----Select---</option>
                    <option value="deactivated">Deactivated</option>
                    <option value="active">Active</option>
                  </Select>
                  <SimpleGrid columns={2} mt={4}>
                    <Box width="100%">
                      <Button
                        bg="#682EF3"
                        color="#ffffff"
                        mr={4}
                        onClick={handleSaveTechnician}
                      >
                        {isEditing ? 'Update' : 'Save'}
                      </Button>
                    </Box>
                    <Box width="100%">
                      <Button
                        bg="#F13130"
                        color="#ffffff"
                        onClick={handleCancelAddTechnician}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </SimpleGrid>
                </SimpleGrid>
              ) : (
                <>
                  <Text
                    className="callsHeaderTitle"
                    fontSize="lg"
                    mb={4}
                    fontWeight="bold"
                    pl="10px"
                  >
                    Select Technicians to remove
                  </Text>
                  {technicians.map((technician, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <Checkbox
                        onChange={() => handleCheckboxChange(technician.id)}
                        isChecked={selectedTechniciansToRemove.includes(
                          technician.id,
                        )}
                      />
                      <Text ml={2}>{technician.name}</Text>
                    </Box>
                  ))}
                </>
              )}
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
};

export default ManageTechnician;
