import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Image,
  Button,
  Input,
  FormControl,
  Checkbox,
  InputGroup,
  Icon,
  InputLeftElement,
  Select,
  useToast,
} from '@chakra-ui/react';
import { MdCall, MdCallEnd, MdAddCall, MdOutlineSearch } from 'react-icons/md';
import gmapImg from 'assets/img/gmap.png';
import DashboardHeader from './DashboardHeader';
import DashboardActiveCallBar from './DashboardActiveCallBar';
import elevatorImg from 'assets/img/sidebarmenu/elevators.png';
import elevatorImgSel from 'assets/img/sidebarmenu/elevatorImgSel.png';
import config from 'config/config';
const Elevators = () => {
  const titleHeighlited = '#0F405B';
  const titlecolor = '#A3AED0';

  const [formMode, setFormMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false); // To toggle delete mode
  const [elevators, setElevators] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElevatorId, setSelectedElevatorId] = useState(null);

  const [newElevator, setNewElevator] = useState({
    id: '',
    status: 'Active',
    street: '',
    city: '',
    zip: '',
    user: '',
    hospital: '',
  });
  const [selectedLiftId, setSelectedLiftId] = useState(elevators); // Default to the first row
  const [selectedElevator, setSelectedElevator] = useState(elevators);
  const [selectedElevators, setSelectedElevators] = useState([]); // Track selected elevators for deletion
  const toast = useToast();

  const handleAddClick = () => {
    setFormMode(true);
    setIsEditMode(false);
    setSelectedElevatorId(null);

    setNewElevator({
      elevatorid: '',
      status: 'Active',
      state: '',
      city: '',
      zip: '',
      user: '',
      company: '',
    });
  };

  const handleEditClick = (elevator) => {
    setFormMode(true);
    setIsEditMode(true);
    setSelectedElevatorId(elevator.id);
    setNewElevator({
      elevatorid: elevator.elevatorid || '',
      status: elevator.status || 'Active',
      state: elevator.state || '',
      city: elevator.city || '',
      zip: elevator.zip || '',
      user: elevator.user || '',
      company: elevator.company || '',
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewElevator((prev) => ({ ...prev, [name]: value }));
  };

  // Handle row click to set active row
  const handleRowClick = (elevator) => {
    setSelectedLiftId(elevator.id);
    setSelectedElevator(elevator); // Update the selected elevator
  };

  const fetchElevators = async () => {
    try {
      let url = `${config.SOS_elivator}/elevators/`;

      const response = await fetch(url);
      const data = await response.json();

      setElevators(data);

      if (data.length > 0) {
        setSelectedLiftId(data[0].id);
        setSelectedElevator(data[0]);
      }
      console.log(data, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    } catch (error) {
      toast({
        title: 'Error loading elevators',
        description: 'There was an error fetching elevators from the server.',
        status: 'error',
      });
    }
  };

  // Fetch elevators from API on mount
  useEffect(() => {
    fetchElevators();
  }, []);

  const handleSave = async () => {
    const url = isEditMode
      ? `${config.SOS_elivator}/elevators/${selectedElevatorId}/`
      : `${config.SOS_elivator}/elevators/`;

    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newElevator),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      toast({
        title: isEditMode ? 'Elevator updated' : 'Elevator added',
        status: 'success',
      });

      // ✅ Refresh elevator list from server
      const refreshed = await fetch(`${config.SOS_elivator}/elevators/`);
      const updatedList = await refreshed.json();
      setElevators(updatedList);

      // ✅ Select the new or updated row
      const updatedElevator = updatedList.find((e) => e.id === data.id);
      if (updatedElevator) {
        setSelectedLiftId(updatedElevator.id);
        setSelectedElevator(updatedElevator);
      }

      // ✅ Reset form and state
      setFormMode(false);
      setIsEditMode(false);
      setSelectedElevatorId(null);
      setNewElevator({
        id: '',
        elevatorid: '',
        status: 'Active',
        street: '',
        city: '',
        zip: '',
        user: '',
        hospital: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong while saving.',
        status: 'error',
      });
    }
  };

  // Delete selected elevators
  const handleDeleteSelected = async () => {
    if (selectedElevators.length === 0) {
      alert('Please select at least one elevator to delete.');
      return;
    }

    if (
      window.confirm('Are you sure you want to delete the selected elevators?')
    ) {
      try {
        await Promise.all(
          selectedElevators.map((elevatorId) =>
            fetch(`${config.SOS_elivator}/elevators/${elevatorId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({}),
            }),
          ),
        );

        setElevators((prevElevators) =>
          prevElevators.filter(
            (elevator) => !selectedElevators.includes(elevator.id),
          ),
        );

        setSelectedElevators([]);
        setDeleteMode(false);

        toast({
          title: 'Elevators deleted',
          status: 'success',
        });
      } catch (error) {
        toast({
          title: 'Error deleting elevators',
          description: 'There was an error deleting the elevators.',
          status: 'error',
        });
      }
    }
  };

  // Handle checkbox selection for delete mode
  const handleCheckboxChange = (elevatorId) => {
    setSelectedElevators((prev) =>
      prev.includes(elevatorId)
        ? prev.filter((id) => id !== elevatorId)
        : [...prev, elevatorId],
    );
  };

  // Toggle delete mode
  const toggleDeleteMode = () => {
    setDeleteMode((prev) => !prev);
    setSelectedElevators([]);
  };

  const YOUR_API_KEY = 'AIzaSyAhM450WINOm2X-J_ewxJxtwmuz_Hk_Wk0';

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
      <DashboardHeader pageName="Elevators" />

      {/* **********************Elevetors Listing*************************************** */}
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={4}
        mt={-40}
        mb={0}
        mr={-4}
        ml={2}
      >
        <SimpleGrid
          columns={1}
          spacing={4}
          textAlign="left"
          id="elevatorListingBox"
        >
          <Box
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            p={6}
            mb={0}
            w="100%"
          >
            <Text
              fontSize={{ base: '18px', md: '20px' }}
              mb={8}
              fontWeight="bold"
              className="callsHeaderTitle"
            >
              All Elevators
              <Button
                bg="#682EF3"
                color="#ffffff"
                ml={4}
                marginLeft="20%"
                onClick={handleAddClick}
              >
                Add Elevator
              </Button>
              {deleteMode ? (
                <>
                  <Button
                    bg="#F13130"
                    color="#ffffff"
                    ml={2}
                    onClick={handleDeleteSelected}
                  >
                    Delete Selected
                  </Button>
                  <Button
                    bg="gray"
                    color="#ffffff"
                    ml={2}
                    onClick={toggleDeleteMode}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  bg="#F13130"
                  color="#ffffff"
                  ml={2}
                  onClick={toggleDeleteMode}
                >
                  Delete Elevators
                </Button>
              )}
            </Text>

            {formMode ? (
              <Box p={4} bg="gray.100" borderRadius="md">
                <Input
                  name="elevatorid"
                  placeholder="Lift ID"
                  value={newElevator.elevatorid}
                  mb={3}
                  onChange={handleInputChange}
                />
                <Select
                  name="status"
                  value={newElevator.status}
                  onChange={handleInputChange}
                  mb={3}
                >
                  <option value="Active">Active</option>
                  <option value="Deactivated">Deactivated</option>
                </Select>
                <Input
                  placeholder="State"
                  name="state"
                  value={newElevator.state}
                  onChange={handleInputChange}
                  mb={3}
                />
                <Input
                  placeholder="City"
                  name="city"
                  value={newElevator.city}
                  onChange={handleInputChange}
                  mb={3}
                />
                <Input
                  placeholder="Zip"
                  name="zip"
                  value={newElevator.zip}
                  onChange={handleInputChange}
                  mb={3}
                />
                <Input
                  placeholder="User"
                  name="user"
                  value={newElevator.user}
                  onChange={handleInputChange}
                  mb={3}
                />
                <Input
                  placeholder="Hospital"
                  name="company"
                  value={newElevator.company}
                  onChange={handleInputChange}
                  mb={3}
                />
                <Button colorScheme="blue" onClick={handleSave}>
                  {isEditMode ? 'Update Elevator' : 'Save Elevator'}
                </Button>
              </Box>
            ) : (
              <Box>
                <ul
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '24% 15% 18% 24% 14% 14%',
                    fontWeight: 'bold',
                    height: '40px',
                  }}
                >
                  {/* <li></li> */}
                  <li className="callsHeaderTitle">Lift ID</li>
                  <li className="callsHeaderTitle">Status</li>
                  <li className="callsHeaderTitle">City</li>
                  <li className="callsHeaderTitle">Zip/Pin</li>
                  <li className="callsHeaderTitle">Action</li>
                </ul>
                {elevators.map((elevator, index) => (
                  <ul
                    key={elevator.id}
                    onClick={() => handleRowClick(elevator)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3% 22% 15% 20% 20% 14%',
                      cursor: 'pointer',
                      //backgroundColor: elevator.id === selectedLiftId ? '#d0e1ff' : index % 2 === 0 ? 'white' : '#f9f9f9',
                    }}
                    //className={elevator.id === selectedLiftId ? 'active-row' : ''} // Add active class if selected
                    className={
                      elevator.id === selectedLiftId
                        ? 'lift-row selected'
                        : 'lift-row'
                    } // Add active class if selected
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
                    <li>
                      <Button
                        color="#ffffff"
                        bg="#632EEE"
                        height="30px"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent row click
                          handleEditClick(elevator);
                        }}
                      >
                        Edit
                      </Button>
                    </li>
                  </ul>
                ))}
              </Box>
            )}
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={1} spacing={4} textAlign="center">
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
            <Box height="200px" borderRadius="lg" overflow="hidden">
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
                    {selectedElevator?.city} , {selectedElevator?.state} ,
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
    </Box>
  );
};

export default Elevators;
