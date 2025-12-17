import React, { useState, useEffect } from 'react';
import config from 'config/config';
import {
  Box,
  SimpleGrid,
  Text,
  Image,
  Button,
  Input,
  FormControl,
  Checkbox,
  Link,
  Select,
  HStack,
} from '@chakra-ui/react';
import noimg from 'assets/img/noimg.png';
import DashboardHeader from './DashboardHeader';

const ManageAgent = () => {
  const [selectedLiftId, setSelectedLiftId] = useState(null);
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState(null);
  const [isRemovingAgent, setIsRemovingAgent] = useState(false);
  const [agentFilter, setAgentFilter] = useState('all');
  const userId = localStorage.getItem('userId');
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zip: '',
    password: '',
    status: '',
    role: 'agent',
    elevators: [''],
  });

  const [agents, setAgents] = useState([]);
  const [selectedAgentsToRemove, setSelectedAgentsToRemove] = useState([]);

  {
    /* ---------------------------Add Elevators----------------------  */
  }
  const handleElevatorChange = (index, value) => {
    const updatedElevators = [...newAgent.elevators];
    updatedElevators[index] = value;
    setNewAgent({ ...newAgent, elevators: updatedElevators });
  };

  const handleAddElevator = () => {
    setNewAgent({ ...newAgent, elevators: [...newAgent.elevators, ''] });
  };

  const handleRemoveElevator = (index) => {
    const updatedElevators = [...newAgent.elevators];
    updatedElevators.splice(index, 1);
    setNewAgent({ ...newAgent, elevators: updatedElevators });
  };
  {
    /* ---------------------------Elevators----------------------  */
  }

  useEffect(() => {
    // Fetch agents data from API using POST
    const fetchAgents = async () => {
      try {
        const user_id = localStorage.getItem('userId');
        const response = await fetch(`${config.SOS_elivator}/allAgent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id }), // Empty body, fetch all agents
        });

        const data = await response.json();
        setAgents(data);

        if (data.length > 0) {
          setSelectedLiftId(data[0].id); // Select the first agent by default
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, [newAgent]);

  const handleRowClick = (liftId) => {
    setSelectedLiftId(liftId);
  };

  const handleAddAgentClick = () => {
    setIsAddingAgent(true);
    setIsEditing(false);
    setNewAgent({
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      zip: '',
      password: '',
      status: '',
      user_id: '',
      elevators: [''],
      role: 'agent',
    });
  };

  const handleCancelAddAgent = () => setIsAddingAgent(false);

  const handleEditAgentClick = (agentId) => {
    const agentToEdit = agents.find((agent) => agent.id === agentId);
    if (agentToEdit) {
      setIsAddingAgent(true);
      setIsEditing(true);
      setEditingAgentId(agentId);
      setNewAgent({
        name: agentToEdit.name,

        email: agentToEdit.email,
        phone: agentToEdit.phone,
        status: agentToEdit.status,
        city: agentToEdit.city || agentToEdit.location.split(', ')[0],
        state: agentToEdit.state || agentToEdit.location.split(', ')[1],
        zip: agentToEdit.zip || '',
        elevators: Array.isArray(agentToEdit?.elevators)
          ? agentToEdit.elevators
          : agentToEdit?.elevators
          ? [agentToEdit.elevators]
          : [''],
        password: agentToEdit.password || '',
      });
    }
  };

  const handleRemoveAgentClick = () => {
    setIsRemovingAgent(true);
    setSelectedAgentsToRemove([]);
  };

  const handleSaveAgent = async () => {
    const generateUniqueId = () => {
      const randomFiveDigit = Math.floor(10000 + Math.random() * 90000);
      return `ID${randomFiveDigit}`;
    };
    const uniqueId = generateUniqueId();

    if (isEditing && editingAgentId) {
      try {
        // Send a PUT request to update the agent's details
        await fetch(`${config.SOS_elivator}/agent/${editingAgentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newAgent.name,
            email: newAgent.email,
            phone: newAgent.phone,
            city: newAgent.city,
            state: newAgent.state,
            zip: newAgent.zip,
            password: newAgent.password,
            elevators: newAgent.elevators,
            // location: `${newAgent.city}, ${newAgent.state}`,
            // address: `${newAgent.city}, ${newAgent.state}, ${newAgent.zip}`,
            status: newAgent.status, // You may need to handle this based on your actual API requirements
          }),
        });

        // Update the agent locally in the state
        const updatedAgents = agents.map((agent) =>
          agent.id === editingAgentId
            ? {
                ...agent,
                name: newAgent.name,
                email: newAgent.email,
                phone: newAgent.phone,
                status: newAgent.status,
                password: newAgent.password,
                location: `${newAgent.city}, ${newAgent.state}`,
                address: `${newAgent.city}, ${newAgent.state}, ${newAgent.zip}`,
              }
            : agent,
        );
        setAgents(updatedAgents);

        // Close the edit form
        setIsEditing(false);
        setIsAddingAgent(false);
        setNewAgent({
          name: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          zip: '',
          status: '',
          password: '',
          role: '',
          user_id: '',
          elevators: [''],
          unique_id: '',
        });
      } catch (error) {
        console.error('Error updating agent:', error);
      }
    } else {
      //const newAgentId = generateUniqueId();
      try {
        // Send a POST request to create a new agent
        await fetch(`${config.SOS_elivator}/agent/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            unique_id: uniqueId,
            user_id: userId,
            name: newAgent.name,
            city: newAgent.city,
            state: newAgent.state,
            email: newAgent.email,
            phone: newAgent.phone,
            zip: newAgent.zip,
            status: newAgent.status,
            elevators: newAgent.elevators,
            password: newAgent.password,
            role: 'agent',
          }),
        });

        // Update the agents list locally
        const updatedAgents = [
          ...agents,
          {
            // id: newAgentId,
            name: newAgent.name,
            city: newAgent.city,
            state: newAgent.state,
            email: newAgent.email,
            phone: newAgent.phone,
            zip: newAgent.zip,
            status: newAgent.status,
            password: newAgent.password,
          },
        ];
        setAgents(updatedAgents);

        // Close the add form
        setIsAddingAgent(false);
        setNewAgent({
          name: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          zip: '',
          status: '',
          password: '',
        });
      } catch (error) {
        console.error('Error adding agent:', error);
      }
    }
  };

  const handleCheckboxChange = (agentId) => {
    if (selectedAgentsToRemove.includes(agentId)) {
      setSelectedAgentsToRemove(
        selectedAgentsToRemove.filter((id) => id !== agentId),
      );
    } else {
      setSelectedAgentsToRemove([...selectedAgentsToRemove, agentId]);
    }
  };

  const handleConfirmRemove = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to remove the selected agents?',
    );

    if (confirmed) {
      try {
        // Perform the DELETE request for each selected agent
        for (let agentId of selectedAgentsToRemove) {
          await fetch(`${config.SOS_elivator}/agent/${agentId}`, {
            method: 'DELETE',
          });
        }

        // Update the state to remove the agents locally after API call success
        setAgents(
          agents.filter((agent) => !selectedAgentsToRemove.includes(agent.id)),
        );
        setIsRemovingAgent(false);
        setSelectedAgentsToRemove([]);
        if (agents.length > 1) {
          setSelectedLiftId(agents[0].id); // Select the first agent if any remain
        }
      } catch (error) {
        console.error('Error removing agents:', error);
      }
    }
  };

  const handleCancelRemove = () => {
    setIsRemovingAgent(false);
    setSelectedAgentsToRemove([]);
  };

  const handleAgentFilterChange = (filter) => {
    setAgentFilter(filter);
  };

  const filteredAgents = agents?.filter((agent) => {
    if (agentFilter === 'active') return agent.status === 'active';
    if (agentFilter === 'deactivated') return agent.status === 'deactivated';

    return true;
  });

  const selectedAgent = filteredAgents.find(
    (agent) => agent.id === selectedLiftId,
  );

  return (
    <Box mt={-7} ml={-5} p={0} mr={0} bg="#eef2f6" minH="100vh">
      <DashboardHeader pageName="Manage Agent" />

      <SimpleGrid
        gridTemplateColumns="60% 39%"
        spacing={4}
        mt={-40}
        mb={0}
        mr={-4}
        ml={2}
        textAlign="left"
        id="leftAgentShowList"
      >
        <Box
          bg="white"
          boxShadow="md"
          borderRadius="lg"
          p={6}
          marginBottom="7"
          w="100%"
        >
          <Button
            mr="15px"
            className={
              agentFilter === 'active'
                ? 'agent-active-button'
                : 'agent-inactive-button'
            }
            onClick={() => handleAgentFilterChange('active')}
          >
            Active Agents
          </Button>
          <Button
            className={
              agentFilter === 'deactivated'
                ? 'agent-active-button'
                : 'agent-inactive-button'
            }
            onClick={() => handleAgentFilterChange('deactivated')}
          >
            Deactivated Agents
          </Button>

          <ul
            style={{
              display: 'grid',
              gridTemplateColumns: '20% 15% 15% 35% 15%',
              fontWeight: 'bold',
              height: '40px',
              marginLeft: '-12px',
              paddingLeft: '12px',
              paddingTop: '6px',
            }}
          >
            <li className="callsHeaderTitle">Agent Name</li>
            <li className="callsHeaderTitle">Status</li>
            <li className="callsHeaderTitle">ID</li>
            <li className="callsHeaderTitle">Location</li>
            <li className="callsHeaderTitle">Action</li>
          </ul>

          {filteredAgents.map((agent) => {
            const isSelected = agent.id === selectedLiftId;
            return (
              <ul
                key={agent.id}
                onClick={() => handleRowClick(agent.id)}
                className={`lift-row ${isSelected ? 'selected' : ''}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20% 15% 15% 35% 15%',
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
                  {agent.name}
                </li>
                <li
                  style={{
                    paddingLeft: 0,
                    textAlign: 'left',
                    paddingTop: '3px',
                  }}
                >
                  <Text
                    color={agent.status === 'active' ? 'green.500' : 'red.500'}
                  >
                    {agent.status}
                  </Text>
                </li>
                <li
                  style={{
                    paddingLeft: 0,
                    textAlign: 'left',
                    paddingTop: '3px',
                  }}
                >
                  {agent.unique_id}
                </li>
                <li
                  style={{
                    paddingLeft: 0,
                    textAlign: 'left',
                    paddingTop: '3px',
                  }}
                >
                  {agent.location}
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
                      handleEditAgentClick(agent.id);
                    }}
                  >
                    Edit
                  </Button>
                </li>
              </ul>
            );
          })}
        </Box>

        {/* Right Panel */}
        <SimpleGrid columns={1} spacing={4} mb={0}>
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={4}>
            {!isRemovingAgent ? (
              <>
                <Button
                  bg="#682EF3"
                  color="#ffffff"
                  marginRight="10px"
                  onClick={handleAddAgentClick}
                >
                  Add Agent
                </Button>
                <Button
                  bg="#F13130"
                  color="#ffffff"
                  onClick={handleRemoveAgentClick}
                >
                  Remove Agent
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

            <SimpleGrid columns={1} spacing={0} mb={0} id="addAgentRemoveAgent">
              {!isAddingAgent && !isRemovingAgent ? (
                <>
                  {/* Show selected agent details */}
                  {selectedAgent && (
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
                        Agent Details
                      </Text>
                      <Image
                        src={noimg}
                        objectFit="cover"
                        width="100%"
                        height="200px"
                      ></Image>
                      <Text fontSize="lg" mb={4} fontWeight="bold">
                        <span
                          className="callsHeaderTitle"
                          style={{ fontSize: '16px' }}
                        >
                          Agent Name:
                        </span>
                        <br />
                        <span
                          className="callsTitleValue"
                          style={{ fontSize: '14px', fontWeight: 'bold' }}
                        >
                          {selectedAgent.name}
                        </span>
                        <br />
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
                          {selectedAgent.location},{selectedAgent.zip}
                        </span>
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
                          {selectedAgent.email}
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
                          {selectedAgent.phone}
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
                          {Array.isArray(selectedAgent.elevators) &&
                            selectedAgent.elevators.map((id, index) => (
                              <Text key={index}>{id}</Text>
                            ))}
                        </span>
                      </Text>
                      <Link href="#" color="#9D8BD4" fontWeight={'bold'}>
                        View Login/Log Out Time &gt;{' '}
                      </Link>
                    </>
                  )}
                </>
              ) : isAddingAgent ? (
                <SimpleGrid columns={1}>
                  {/* Add/Edit Agent Form */}
                  <Text
                    className="callsHeaderTitle"
                    fontSize="lg"
                    mb={4}
                    fontWeight="bold"
                    width="100%"
                    mt="20px"
                    pl="10px"
                  >
                    {isEditing ? 'Edit Agent' : 'Add New Agent'}
                  </Text>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Name"
                      value={newAgent.name}
                      onChange={(e) =>
                        setNewAgent({ ...newAgent, name: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Email"
                      value={newAgent.email}
                      onChange={(e) =>
                        setNewAgent({ ...newAgent, email: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Phone"
                      value={newAgent.phone}
                      onChange={(e) =>
                        setNewAgent({ ...newAgent, phone: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="City"
                      value={newAgent.city}
                      onChange={(e) =>
                        setNewAgent({ ...newAgent, city: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="State"
                      value={newAgent.state}
                      onChange={(e) =>
                        setNewAgent({ ...newAgent, state: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <Input
                      placeholder="Zip"
                      value={newAgent.zip}
                      onChange={(e) =>
                        setNewAgent({ ...newAgent, zip: e.target.value })
                      }
                    />
                  </FormControl>

                  {/* ---------------------------Add Elevators----------------------  */}
                  <>
                    {newAgent.elevators.map((elevator, index) => (
                      <FormControl mb={4} key={index}>
                        <HStack>
                          <Input
                            placeholder="elevatorsId"
                            value={elevator}
                            onChange={(e) =>
                              handleElevatorChange(index, e.target.value)
                            }
                          />
                          {newAgent.elevators.length > 1 && (
                            <Button
                              colorScheme="red"
                              onClick={() => handleRemoveElevator(index)}
                            >
                              -
                            </Button>
                          )}
                          {/* Show + only for the last input */}
                          {index === newAgent.elevators.length - 1 && (
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
                      value={newAgent.password}
                      onChange={(e) =>
                        setNewAgent({ ...newAgent, password: e.target.value })
                      }
                    />

                    <Select
                      name="status"
                      value={newAgent.status}
                      onChange={(e) =>
                        setNewAgent({ ...newAgent, status: e.target.value })
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
                        onClick={handleSaveAgent}
                      >
                        {isEditing ? 'Update' : 'Save'}
                      </Button>
                    </Box>
                    <Box width="100%">
                      <Button
                        bg="#F13130"
                        color="#ffffff"
                        onClick={handleCancelAddAgent}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </SimpleGrid>
                </SimpleGrid>
              ) : (
                <>
                  {/* Show agents to remove */}
                  <Text
                    className="callsHeaderTitle"
                    fontSize="lg"
                    mb={4}
                    fontWeight="bold"
                    pl="10px"
                  >
                    Select Agents to remove
                  </Text>
                  {agents.map((agent, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <Checkbox
                        onChange={() => handleCheckboxChange(agent.id)}
                        isChecked={selectedAgentsToRemove.includes(agent.id)}
                      />
                      <Text ml={2}>{agent.name}</Text>
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

export default ManageAgent;
