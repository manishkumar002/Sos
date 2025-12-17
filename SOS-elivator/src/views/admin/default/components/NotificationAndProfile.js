import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Text,
  Badge,
  Divider,
  VStack,
} from '@chakra-ui/react';
import {
  BellIcon,
  EmailIcon,
  InfoOutlineIcon,
  AtSignIcon,
} from '@chakra-ui/icons';
import { MdLogout } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

const NotificationAndProfile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
  });

  const notifications = [
    { id: 1, message: 'New message from admin' },
    { id: 2, message: 'Your task is due tomorrow' },
    { id: 3, message: 'System update available' },
  ];

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('responseData'));
    if (savedData) {
      setUserData({
        name: savedData.user.name,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage
    navigate('/auth/sign-in');
  };

  return (
    <Box p={4}>
      <Flex
        align="center"
        justify="flex-end"
        background="gray.100"
        borderRadius="25px"
        px={4}
      >
        {/* Notification Icon */}
        <Popover>
          <PopoverTrigger>
            <IconButton
              icon={<BellIcon />}
              aria-label="Notifications"
              variant="ghost"
              fontSize="26px"
              position="relative"
            />
          </PopoverTrigger>
          <PopoverContent
            width={{ base: '90vw', md: '250px' }}
            maxW="400px"
            shadow="lg"
            overflowY="auto"
            maxH="300px"
            bg="white"
            zIndex={10}
          >
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              {notifications.length === 0 ? (
                <Text>No notifications</Text>
              ) : (
                notifications.map((notification) => (
                  <Box
                    key={notification.id}
                    p={2}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    _last={{ borderBottom: 'none' }}
                  >
                    <Text fontSize="sm" wordBreak="break-word">
                      {notification.message}
                    </Text>
                  </Box>
                ))
              )}
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {/* Profile Menu */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Avatar size="sm" name={userData.name} />}
            ml={4}
            variant="ghost"
          />
          <MenuList p={2}>
            <Link to="/admin/profile">
              <MenuItem>View Profile</MenuItem>
            </Link>
            <MenuItem
              icon={<MdLogout />}
              onClick={handleLogout}
              color="red.500"
            >
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default NotificationAndProfile;
