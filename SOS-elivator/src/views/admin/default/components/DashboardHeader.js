import React, { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import dash_bgimg from 'assets/img/dash_bgimg.jpg';
//import Navbar from 'components/navbar/NavbarAdmin.js';
import NotificationAndProfile from './NotificationAndProfile';
import 'assets/css/DashboardHeader.css';

const DashboardHeader = ({ pageName }) => {
  const [role, setRole] = useState(null); // State to store the role of the user
  useEffect(() => {
    const userRole = localStorage.getItem('role'); // Assuming the role is stored as 'role'
    setRole(userRole);
  }, []);
  document.documentElement.dir = 'ltr';
  //const { onOpen } = useDisclosure();
  return (
    <Flex
      className="my_dashboard_header_flex"
      justifyContent="space-between"
      mb={1}
      //bg={dash_bgimg}
      backgroundImage={dash_bgimg}
      backgroundSize="cover"
      backgroundPosition="right"
      mt="-5"
      pl="5"
      pr="-2"
      pt="5"
      ml="-4"
      mr="-7"
      //minH={['52vh', '72vh', '35vh']}
      maxH="10"
      display="flex"
    >
      <Text fontSize="2xl" fontWeight="bold" color="blue.700">
        <span
          style={{
            fontSize: '14px',
            color: 'black',
            border: '2px solid #FFB800',
            borderRadius: '25px',
            padding: '5px 15px 5px 15px',
          }}
        >
          {role === 'superadmin' && 'Super Admin'}
          {role === 'agent' && 'Agent'}
          {role === 'user' && 'User'}
          {!role && 'Role not available'}
        </span>
        <br />
        <span
          style={{
            fontSize: '48px',
            color: '#0F405B',
            fontWeight: 'bold',
            marginTop: '5px',
            display: 'inline-block',
          }}
        >
          {pageName}
        </span>
      </Text>

      <Box display="" alignItems="center">
        {/* <Navbar
              onOpen={onOpen}
              logoText={'Logout'}
              position="relative"
            /> */}
        <NotificationAndProfile></NotificationAndProfile>
      </Box>
    </Flex>
  );
};

export default DashboardHeader;
