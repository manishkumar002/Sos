import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Input,
  Button,
} from "@chakra-ui/react";
import {convertToUserTime} from "../timestamp";
import { EditIcon } from "@chakra-ui/icons";
import DashboardHeader from "./DashboardHeader";
import config from "config/config";

const AgentNotes = () => {
  const AgentName = localStorage.getItem("agentName");

  const [notesList, setNotesList] = useState([]);
  const [agentNotes, setAgentNotes] = useState('');
  const [liftId, setLiftId] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null); // <-- new state

  const AgentNotesAdd = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/addNotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lift_id: liftId,
          name: AgentName,
          notes: agentNotes,
        }),
      });

      const result = await response.json();
      console.log('Added:', result);
      setAgentNotes('');
      setLiftId('');
      fetchAgentNotes();
    } catch (error) {
      console.error('Error adding agent notes:', error);
    }
  };

  const AgentNotesUpdate = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/addNotes/${editingNoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lift_id: liftId,
          notes: agentNotes,
        }),
      });

      const result = await response.json();
      console.log('Updated:', result);
      setAgentNotes('');
      setEditingNoteId(null);
      fetchAgentNotes();
    } catch (error) {
      console.error('Error updating agent note:', error);
    }
  };

  const handleEditClick = (note) => {
    setAgentNotes(note.notes);
    setEditingNoteId(note.id);
  };

 const fetchAgentNotes = async () => {
  try {
    const response = await fetch(`${config.SOS_elivator}/getNoteList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // You can add filters here if needed
    });

    const result = await response.json();
    const data = result.NotesLists || [];
    setNotesList(data);
  } catch (error) {
    console.error('Failed to fetch agent notes:', error);
  }
};


  useEffect(() => {
    fetchAgentNotes();
  }, []);

  const renderNotes = (list) => {
    const filteredNotes = list.filter(note => note.name === AgentName);

    return (
      <VStack spacing={4} mt={6}>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Box
              key={note.id}
              bg="yellow.100"
              p={4}
              borderRadius="md"
              w="100%"
              boxShadow="sm"
            >
              <Flex justify="space-between" align="center" flexWrap="wrap" mb={2}>
                <HStack spacing={6} wrap="wrap">
                  <Text fontWeight="bold" color="green.800">
                    {note.name}
                  </Text>
                  <Text fontWeight="bold" color="blackAlpha.800">
                    {note.lift_id}
                  </Text>
                  <Text fontWeight="bold" color="blackAlpha.800">
                    {convertToUserTime(note.timestamp)}
                  </Text>
                </HStack>
                <Icon
                  as={EditIcon}
                  color="purple.500"
                  boxSize={5}
                  cursor="pointer"
                  onClick={() => handleEditClick(note)} // <-- trigger edit
                />
              </Flex>
              <Text mt={1} fontSize="sm" color="gray.700">
                {note.notes}
              </Text>
            </Box>
          ))
        ) : (
          <Text color="gray.500" mt={4}>No notes found for you.</Text>
        )}
      </VStack>
    );
  };

  return (
    <Box mt={-7} ml={-5} p={4} bg="#eef2f6" minH="100vh">
      <DashboardHeader pageName="Notes" />
      <SimpleGrid columns={1} spacing={4} mt={-40} textAlign="left">
        <Box p={4} bg="white" boxShadow="md" borderRadius="lg">
          <Text fontSize="lg" fontWeight="bold" color="purple.700" mb={2}>
            Personal Notes
          </Text>

          {renderNotes(notesList)}

          <Flex mt={6} align="center" gap={4}>
            <Input
              placeholder="Type Here..."
              value={agentNotes}
              onChange={(e) => setAgentNotes(e.target.value)}
              bg="white"
              borderRadius="full"
            />
            <Button
              colorScheme="purple"
              borderRadius="full"
              onClick={editingNoteId ? AgentNotesUpdate : AgentNotesAdd}
            >
              {editingNoteId ? "Update Note" : "Save Note"}
            </Button>
          </Flex>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default AgentNotes;
