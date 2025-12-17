import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Center,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config'; // ✅ adjust path if needed

const Fargetpassword = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const response = await axios.post(`${config.SOS_elivator}/send-otp`, {
        email,
      });

      if (response.data.success) {
        toast({
          title: 'OTP Sent',
          description: 'Check your email for the OTP.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });

        navigate('/auth/confirm-password', { state: { email } }); // Pass email to next screen
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to send OTP.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Send OTP failed:', error);
      toast({
        title: 'Server Error',
        description: 'Could not send OTP. Try again later.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Box minH="100vh" bg="#6C63FF">
      <Center h="100vh">
        <Box
          bg="white"
          p={8}
          borderRadius="md"
          boxShadow="lg"
          w="100%"
          maxW="350px"
          textAlign="center"
        >
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            Forgot Password
          </Text>
          <Text fontSize="sm" color="gray.600" mb={5}>
            Enter your email address
          </Text>

          <VStack spacing={4}>
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="md"
              bg="gray.100"
            />

            <Button
              colorScheme="purple"
              w="100%"
              onClick={handleSubmit}
              fontWeight="bold"
            >
              Continue
            </Button>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
};

export default Fargetpassword;
