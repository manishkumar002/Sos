import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import config from 'config/config';
import axios from 'axios'; // Import axios

function SignIn() {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the API request
      const response = await axios.post(`${config.SOS_elivator}/login`, {
        email,
        password,
      });

      // Print the entire response.data to the console
      console.log('Response Data:', response.data);
      localStorage.setItem('responseData', JSON.stringify(response.data));
      if (response.data.success) {
        //const { role, token } = response.data;
        const { user, token } = response.data;
        const role = user.role;

        // Save the token and role in localStorage for authentication
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('role', role);
        localStorage.setItem('token', token); // Optional: Store the token if you need to authenticate future requests

        // Navigate to the appropriate page based on the user role

        //console.log(role);
        if (role === 'superadmin') {
          localStorage.setItem('authenticated', 'true');
          localStorage.setItem('role', role);
          localStorage.setItem('adminName', response.data?.user?.name);
          navigate('/admin/default');
        } else if (role === 'agent') {
          localStorage.setItem('authenticated', 'true');
          localStorage.setItem('role', role);
          localStorage.setItem('agentId', response.data?.user?.unique_id);
          localStorage.setItem('agentName', response.data?.user?.name);

          navigate('/admin/activecall');
        } else if (role === 'user') {
          localStorage.setItem('authenticated', 'true');
          localStorage.setItem('role', role);
          localStorage.setItem('userId', response.data?.user?.unique_id);
          navigate('/admin/default');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('An error occurred while logging in. Please try again.');
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '4vh' }}
        flexDirection="column"
      >
        <Box me="auto" textAlign={{ base: 'center', md: 'left' }}>
          <Heading
            color="#A6BFFF"
            fontSize={{ base: '22px', md: '26px' }}
            mb="10px"
          >
            Welcome to
          </Heading>
          <Heading
            color="#2A3672"
            fontSize={{ base: '40px', md: '56px' }}
            mb="10px"
          >
            Axiom Elevators
          </Heading>
          <Heading
            color="#32386B"
            fontSize={{ base: '16px', md: '20px' }}
            mb="10px"
          >
            Enterprise Elevator Services
          </Heading>
          <HSeparator
            width={{ base: '50%', md: '30%' }}
            mb="60px"
            style={{
              height: '2px',
              backgroundColor: '#A6BFFF',
              marginBottom: '30px',
            }}
          >
            <Text color="gray.400" mx="14px"></Text>
          </HSeparator>
          <Heading
            color="#29346B"
            fontSize={{ base: '20px', md: '24px' }}
            marginTop="14"
          >
            Sign In
          </Heading>
          <Text
            mb="15px"
            ms="4px"
            color="#C2C8D4"
            fontWeight="400"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            Enter your email and password to sign in!
          </Text>
        </Box>

        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color="#70748B"
                mb="8px"
              >
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="email"
                placeholder="mail@simmmple.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                id="email"
                border="2px solid #D4DCEF"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color="#70748B"
                display="flex"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="24px"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  variant="auth"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  border="2px solid #D4DCEF"
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>

              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    id="remember-login"
                    colorScheme="brandScheme"
                    me="10px"
                  />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    fontWeight="normal"
                    color="#70748B"
                    fontSize="sm"
                  >
                    Keep me logged in
                  </FormLabel>
                </FormControl>
                <NavLink to="/auth/forgot-password">
                  <Text
                    color="#7865E0"
                    fontSize="sm"
                    w="124px"
                    fontWeight="500"
                  >
                    Forgot password?
                  </Text>
                </NavLink>
              </Flex>
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                type="submit"
                bg="#4318FE"
              >
                Sign In
              </Button>
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
