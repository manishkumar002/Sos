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
import { EditIcon } from "@chakra-ui/icons";
import {convertToUserTime} from "../timestamp";
import DashboardHeader from "./DashboardHeader";
import config from "config/config";

const AdminNotes = () => {
  const AdminName = localStorage.getItem("adminName");

  const [notesList, setNotesList] = useState([]);
  const [adminNotes, setAdminNotes] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null); // <-- new state

  const AdminNotesAdd = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/addNotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: AdminName,
          notes: adminNotes,
        }),
      });

      const result = await response.json();
      console.log('Added:', result);
      setAdminNotes('');
      fetchAgentNotes();
    } catch (error) {
      console.error('Error adding agent notes:', error);
    }
  };

  const AdminNotesUpdate = async () => {
    try {
      const response = await fetch(`${config.SOS_elivator}/addNotes/${editingNoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: adminNotes,
       }),
      });

      const result = await response.json();
      console.log('Updated:', result);
      setAdminNotes('');
      setEditingNoteId(null);
      fetchAgentNotes();
    } catch (error) {
      console.error('Error updating agent note:', error);
    }
  };

  const handleEditClick = (note) => {
    setAdminNotes(note.notes);
    setEditingNoteId(note.id);
  };

 const fetchAgentNotes = async () => {
  try {
    const response = await fetch(`${config.SOS_elivator}/getNoteList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // Sending empty body to get all data
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
    const filteredNotes = list.filter(note => note.name === AdminName);

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
    <Box mt={-7} ml={-5} p={4}  minH="100vh">
     
      <SimpleGrid columns={1} spacing={4}  textAlign="left">
          {renderNotes(notesList)}

          <Flex mt={6} align="center" gap={4}>
            <Input
              placeholder="Type Here..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              bg="white"
              borderRadius="full"
            />
            <Button
              colorScheme="purple"
              borderRadius="full"
              onClick={editingNoteId ? AdminNotesUpdate : AdminNotesAdd}
            >
              {editingNoteId ? "Update Note" : "Save Note"}
            </Button>
          </Flex>
      
      </SimpleGrid>
    </Box>
  );
};

export default AdminNotes;
