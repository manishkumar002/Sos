import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Center,
  useToast,
  FormControl,
  FormLabel,
  Heading,
} from '@chakra-ui/react';
import config from '../../config/config';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
const NewsubmitPassword = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || !password) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in both OTP and new password.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const response = await axios.post(`${config.SOS_elivator}/submit-otp`, {
        otp,
        password,
      });

      if (response.data.success) {
        toast({
          title: 'Password Updated',
          description: 'Your password has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        navigate('/auth/sign-in', { state: { email } });
      } else {
        toast({
          title: 'Failed',
          description: response.data.message || 'Wrong OTP or server error.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Server Error',
        description: 'An error occurred while updating the password.',
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
          borderRadius="lg"
          boxShadow="lg"
          w="100%"
          maxW="400px"
        >
          <Heading size="lg" textAlign="center" mb={4}>
            Reset Password
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>OTP</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                width="full"
                fontWeight="bold"
              >
                Change Password
              </Button>
            </VStack>
          </form>
        </Box>
      </Center>
    </Box>
  );
};

export default NewsubmitPassword;
