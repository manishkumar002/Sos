import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Image,
  Button,
  Input,
  FormControl,
  Select,
  Checkbox,
  IconButton,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import config from 'config/config';
import noimg from 'assets/img/noimg.png';
import DashboardHeader from './DashboardHeader';
import axios from 'axios';
const ManageUser = () => {
  const [selectedLiftId, setSelectedLiftId] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isRemovingUser, setIsRemovingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zip: '',
    status: '',
    password: '',
    elevators: [''],
    role: 'user', // Role will be handled as a dropdown now
  });
  const [users, setUsers] = useState([]);
  const [selectedUserToRemove, setSelectedUserToRemove] = useState([]);

  const apiUrl = `${config.SOS_elivator}/`;

  {
    /* ---------------------------Add Elevators----------------------  */
  }
  const handleElevatorChange = (index, value) => {
    const updatedElevators = [...newUser.elevators];
    updatedElevators[index] = value;
    setNewUser({ ...newUser, elevators: updatedElevators });
  };

  const handleAddElevator = () => {
    setNewUser({ ...newUser, elevators: [...newUser.elevators, ''] });
  };

  const handleRemoveElevator = (index) => {
    const updatedElevators = [...newUser.elevators];
    updatedElevators.splice(index, 1);
    setNewUser({ ...newUser, elevators: updatedElevators });
  };
  {
    /* ---------------------------Elevators----------------------  */
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/allUsers`, {
        method: 'POST', // Using POST method
        headers: {
          'Content-Type': 'application/json', // Send the request body as JSON
        },
        body: JSON.stringify({}), // Empty object if no specific filter, can add filters here
      });

      const data = await response.json(); // Parsing the JSON response
      console.log(data);

      // Check if the data is an array
      if (Array.isArray(data)) {
        setUsers(data);
        if (data.length > 0) {
          setSelectedLiftId(data[0].id); // Auto-select the first user if data exists
        }
      } else {
        console.error('Fetched data is not an array:', data);
        setUsers([]); // Reset to empty array if data format is incorrect
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRowClick = (liftId) => {
    setSelectedLiftId(liftId);
  };

  const handleAddUserClick = () => {
    setIsAddingUser(true);
    setIsEditing(false);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      zip: '',
      password: '',
      status: '',
      elevators: [''],
      role: 'user',
    });
  };

  const handleCancelAddUser = () => setIsAddingUser(false);

  const handleEditUserClick = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      setIsAddingUser(true);
      setIsEditing(true);
      setEditingUserId(userId);
      setNewUser({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        city: userToEdit.city,
        state: userToEdit.state,
        zip: userToEdit.zip || '',
        status: userToEdit.status,
        elevators: Array.isArray(userToEdit?.elevators)
          ? userToEdit.elevators
          : userToEdit?.elevators
          ? [userToEdit.elevators]
          : [''],
        password: userToEdit.password || '',
        role: userToEdit.role || '', // Set the role field
      });
    }
  };

  const handleRemoveUserClick = () => setIsRemovingUser(true);

  const handleSaveUser = async () => {
    const generateUniqueId = () => {
      const randomFiveDigit = Math.floor(10000 + Math.random() * 90000);
      return `ID${randomFiveDigit}`;
    };
    const uniqueId = generateUniqueId();

    if (isEditing && editingUserId) {
      try {
        const response = await fetch(
          `${config.SOS_elivator}/users/${editingUserId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...newUser,
              city: newUser.city,
              state: newUser.state,
              zip: newUser.zip,
              status: newUser.status,

              // location: `${newUser.city}, ${newUser.state}`,
              // address: `${newUser.city}, ${newUser.state}, ${newUser.zip}`,
            }),
          },
        );
        if (response.ok) {
          fetchUsers();
          setIsEditing(false);
          setIsAddingUser(false);
        } else {
          console.error('Error updating user');
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      try {
        const response = await fetch(`${config.SOS_elivator}/users/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newUser,
            city: newUser.city,
            state: newUser.state,
            zip: newUser.zip,
            status: newUser.status,
            unique_id: uniqueId,
            // location: `${newUser.city}, ${newUser.state}`,
            // address: `${newUser.city}, ${newUser.state}, ${newUser.zip}`,
          }),
        });
        if (response.ok) {
          fetchUsers();
          setIsAddingUser(false);
        } else {
          console.error('Error adding user');
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }

    setNewUser({
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      zip: '',
      status: '',
      password: '',
      elevators: [''],
      role: 'user',
      unique_id: '',
    });
  };

  const handleCheckboxChange = (userId) => {
    if (selectedUserToRemove.includes(userId)) {
      setSelectedUserToRemove(
        selectedUserToRemove.filter((id) => id !== userId),
      );
    } else {
      setSelectedUserToRemove([...selectedUserToRemove, userId]);
    }
  };

  const handleConfirmRemove = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to remove the selected technicians?',
    );
    if (confirmed) {
      try {
        for (const userId of selectedUserToRemove) {
          await axios.delete(`${apiUrl}/${userId}`);
        }
        fetchUsers(); // Re-fetch technicians after deletion
        setIsRemovingUser(false);
        setSelectedUserToRemove([]);
      } catch (error) {
        console.error('Error removing technicians:', error);
      }
    }
  };

  const handleCancelRemove = () => {
    setIsRemovingUser(false);
    setSelectedUserToRemove([]);
  };

  // const handleRemoveUserClick = () => {
  //   if (selectedUsersToRemove.length > 0) {
  //     setIsRemovingUser(true);
  //   } else {
  //     alert('Please select at least one user to remove.');
  //   }
  // };

  // const handleConfirmRemove = async () => {
  //   try {
  //     const confirmed = window.confirm(
  //       'Are you sure you want to remove the selected users?',
  //     );
  //     if (confirmed) {
  //       for (let userId of selectedUsersToRemove) {
  //         await fetch(`http://localhost:5000/api/users/${userId}`, {
  //           method: 'DELETE',
  //         });
  //       }
  //       fetchUsers();
  //       setIsRemovingUser(false);
  //       setSelectedUsersToRemove([]);
  //     }
  //   } catch (error) {
  //     console.error('Error removing users:', error);
  //   }
  // };

  // const handleCancelRemove = () => {
  //   setIsRemovingUser(false);
  //   setSelectedUsersToRemove([]);
  // };

  const selectedUser = users.find((user) => user.id === selectedLiftId);

  return (
    <Box mt={-7} ml={-5} p={0} mr={0} bg="#eef2f6" minH="100vh">
      <DashboardHeader pageName="Manage User" />
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
              gridTemplateColumns: '24% 15% 18% 24% 14%',
              fontWeight: 'bold',
              height: '40px',
              marginLeft: '-12px',
              paddingLeft: '12px',
              paddingTop: '6px',
            }}
          >
            <li className="callsHeaderTitle">User Name</li>
            <li className="callsHeaderTitle">Status</li>
            <li className="callsHeaderTitle">Id</li>{' '}
            {/* New Role Column Header */}
            <li className="callsHeaderTitle">Location</li>
            <li className="callsHeaderTitle">Action</li>
          </ul>
          {users.map((user) => {
            const isSelected = user.id === selectedLiftId;
            return (
              <ul
                key={user.id}
                onClick={() => handleRowClick(user.id)}
                className={`lift-row ${isSelected ? 'selected' : ''}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '24% 15% 18% 24% 14%',
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
                  {user.name}
                </li>
                <li
                  style={{
                    paddingLeft: 0,
                    textAlign: 'left',
                    paddingTop: '3px',
                  }}
                >
                  <Text
                    color={user.status === 'active' ? 'green.500' : 'red.500'}
                  >
                    {user.status}
                  </Text>
                </li>
                <li
                  style={{
                    paddingLeft: 0,
                    textAlign: 'left',
                    paddingTop: '3px',
                  }}
                >
                  {user.unique_id}
                </li>
                <li
                  style={{
                    paddingLeft: 0,
                    textAlign: 'left',
                    paddingTop: '3px',
                  }}
                >
                  {user.location}
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
                      handleEditUserClick(user.id);
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
            {!isRemovingUser ? (
              <>
                <Button
                  bg="#682EF3"
                  color="#ffffff"
                  marginRight="10px"
                  onClick={handleAddUserClick}
                >
                  Add User
                </Button>
                <Button
                  bg="#F13130"
                  color="#ffffff"
                  onClick={handleRemoveUserClick}
                >
                  Remove User
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

            <SimpleGrid columns={1} spacing={0} mb={0} id="addUserRemoveUser">
              {!isAddingUser && !isRemovingUser ? (
                <>
                  {selectedUser && (
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
                        User Details
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
                          {selectedUser.location}
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
                          {selectedUser.email}
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
                          {selectedUser.phone}
                        </span>
                        <br />
                        <span
                          className="callsHeaderTitle"
                          style={{ fontSize: '16px' }}
                        >
                          Lift Access:
                        </span>
                        <br />
                        <span
                          className="callsTitleValue"
                          style={{ fontSize: '14px', fontWeight: 'bold' }}
                        >
                          {Array.isArray(selectedUser.elevators) &&
                            selectedUser.elevators.map((id, index) => (
                              <Text key={index}>{id}</Text>
                            ))}
                        </span>
                      </Text>
                    </>
                  )}
                </>
              ) : isAddingUser ? (
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
                    {isEditing ? 'Edit User' : 'Add New User'}
                  </Text>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Phone"
                      value={newUser.phone}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phone: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="City"
                      value={newUser.city}
                      onChange={(e) =>
                        setNewUser({ ...newUser, city: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="State"
                      value={newUser.state}
                      onChange={(e) =>
                        setNewUser({ ...newUser, state: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Zip"
                      value={newUser.zip}
                      onChange={(e) =>
                        setNewUser({ ...newUser, zip: e.target.value })
                      }
                    />
                  </FormControl>

                  {/* ---------------------------Add Elevators----------------------  */}
                  <>
                    {newUser.elevators.map((elevator, index) => (
                      <FormControl mb={4} key={index}>
                        <HStack>
                          <Input
                            placeholder="elevatorsId"
                            value={elevator}
                            onChange={(e) =>
                              handleElevatorChange(index, e.target.value)
                            }
                          />
                          {newUser.elevators.length > 1 && (
                            <Button
                              colorScheme="red"
                              onClick={() => handleRemoveElevator(index)}
                            >
                              -
                            </Button>
                          )}
                          {/* Show + only for the last input */}
                          {index === newUser.elevators.length - 1 && (
                            <Button
                              colorScheme="green"
                              onClick={handleAddElevator}
                            >
                              +
                            </Button>
                          )}
                        </HStack>
                      </FormControl>
                    ))}
                  </>

                  {/* ---------------------------Add Elevators----------------------  */}

                  <FormControl mb={4}>
                    <Input
                      placeholder="Password"
                      type="text"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    {/* Role field as dropdown
                    <Select
                      placeholder="Select Role"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                    >
                      <option value="agent">Agent</option>
                      <option value="user">User</option>
                      <option value="superadmin">Super Admin</option>
                    </Select> */}

                    <Select
                      name="status"
                      value={newUser.status}
                      onChange={(e) =>
                        setNewUser({ ...newUser, status: e.target.value })
                      }
                      mt={3}
                    >
                      <option>----Select---</option>
                      <option value="deactivated">Deactivated</option>
                      <option value="active">Active</option>
                    </Select>
                  </FormControl>

                  <SimpleGrid columns={2}>
                    <Box width="100%">
                      <Button
                        bg="#682EF3"
                        color="#ffffff"
                        mr={4}
                        onClick={handleSaveUser}
                      >
                        {isEditing ? 'Update' : 'Save'}
                      </Button>
                    </Box>
                    <Box width="100%">
                      <Button
                        bg="#F13130"
                        color="#ffffff"
                        onClick={handleCancelAddUser}
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
                  {users.map((item, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <Checkbox
                        onChange={() => handleCheckboxChange(item.id)}
                        isChecked={selectedUserToRemove.includes(item.id)}
                      />
                      <Text ml={2}>{item.name}</Text>
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

export default ManageUser;
