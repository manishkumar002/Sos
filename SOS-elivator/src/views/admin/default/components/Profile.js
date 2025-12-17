import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Text,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

export default function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    uniqueId: '',
    city: '',
    state: '',
    phone: '',
    elevators: '',
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('responseData'));
    if (saved && saved.user) {
      setUserData({
        name: saved.user.name || '',
        email: saved.user.email || '',
        role: saved.user.role || '',
        uniqueId: saved.user.unique_id || '',
        city: saved.user.city || '',
        state: saved.user.state || '',
        phone: saved.user.phone || '',
        elevators: saved.user.elevators || '',
      });
    }
  }, []);

  // Split full name for optional display
  const [firstName = '', lastName = ''] = userData.name.split(' ');

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.100', 'gray.800')}
      px={4}
      py={10}
    >
      <Box bg="white" rounded="lg" shadow="lg" p={8} w="full" maxW="3xl">
        <Flex align="center" mb={6}>
          <Avatar size="xl" name={userData.name} mr={4} />
          <IconButton
            icon={<EditIcon />}
            size="sm"
            mt={10}
            variant="ghost"
            aria-label="Edit (disabled)"
            isDisabled
          />
          <Heading fontSize="2xl" ml={4}>
            Personal Information
          </Heading>
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Text>{firstName}</Text>
          </FormControl>

          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Text>{lastName}</Text>
          </FormControl>

          <FormControl gridColumn="span 2">
            <FormLabel>Email</FormLabel>
            <Text>{userData.email}</Text>
          </FormControl>

          <FormControl>
            <FormLabel>Role</FormLabel>
            <Text>{userData.role}</Text>
          </FormControl>

          <FormControl>
            <FormLabel>Unique ID</FormLabel>
            <Text>{userData.uniqueId}</Text>
          </FormControl>
          <FormControl>
            <FormLabel>phone</FormLabel>
            <Text>{userData.phone}</Text>
          </FormControl>
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Text>
              {userData.city},{userData.state}
            </Text>
          </FormControl>
        </Grid>
      </Box>
    </Flex>
  );
}
