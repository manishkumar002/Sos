import React from 'react';
import {
  Box,
  SimpleGrid,
  Flex,
  Text,
  Icon,
  Input,
  Button,
} from '@chakra-ui/react';
import {
  IconButton,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import { MdPhone, MdOutlineSearch } from 'react-icons/md';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { MdCall, MdCallEnd } from 'react-icons/md';
//import gmap from '../../../assets/img/gmap.png';
//import gmapImg from 'assets/img/gmap.png';

const Dashboard = () => {
  const brandColor = useColorModeValue('brand.500', 'white');
  // Sample data for the graph
  const data = [
    { calls: 190 },
    { calls: 130 },
    { calls: 250 },
    { calls: 170 },
    { calls: 210 },
    { calls: 270 },
    { calls: 100 },
  ];
  return (
    <Box p={6} bg="#eef2f6" minH="100vh">
      {/* Dashboard Header */}
      <Flex justifyContent="space-between" mb={8}>
        <Text fontSize="2xl" fontWeight="bold" color="blue.700">
          Super Admin Dashboard
        </Text>
        <Box display="flex" alignItems="center">
          <Box bg="gray.200" p={2} borderRadius="full">
            {/* Notification Icon */}
            <Icon as={MdPhone} color="blue.500" w={6} h={6} />
          </Box>
        </Box>
      </Flex>

      <SimpleGrid columns={2} spacing={8} mb={8}>
        <SimpleGrid columns={3} spacing={8} mb={8}>
          <Box height="80px">
            <MiniStatistics
              bg="transparent"
              startContent={
                <IconBox
                  w="42px"
                  h="42px"
                  //bg={boxBg}
                  bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                  icon={
                    <Icon w="20px" h="20px" as={MdCall} color={brandColor} />
                  }
                />
              }
              name="Active Calls"
              value="75"
            />
          </Box>

          <Box height="80px">
            <MiniStatistics
              bg="transparent"
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  //bg={boxBg}
                  bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                  icon={
                    <Icon w="32px" h="32px" as={MdCallEnd} color={brandColor} />
                  }
                />
              }
              name="Finished Calls"
              value="140"
            />
          </Box>

          <Box height="80px">
            <MiniStatistics
              bg="transparent"
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  //bg={boxBg}
                  bg="white"
                  icon={
                    <Icon w="32px" h="32px" as={MdCallEnd} color={brandColor} />
                  }
                />
              }
              name="Waiting Calls"
              value="6"
            />
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={1} spacing={8} mb={8}>
          <Flex mb={8} justifyContent="space-between">
            <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={8}>
              <Input placeholder="Elevator ID" maxW="150px" mr={2} />
              <Input placeholder="Agent ID" maxW="150px" mr={2} />
              <Button leftIcon={<MdOutlineSearch />} colorScheme="blue">
                Search
              </Button>
            </Box>
          </Flex>
        </SimpleGrid>
      </SimpleGrid>

      {/* Active Calls Table */}
      <SimpleGrid columns={2} spacing={4} textAlign="center">
        <SimpleGrid columns={3} spacing={4} textAlign="center">
          <Box
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            p={6}
            mb={8}
            width="540px"
          >
            <Text fontSize="lg" mb={4} fontWeight="bold">
              Active Calls
            </Text>
            <SimpleGrid columns={4} spacing={4} textAlign="center">
              <Text fontWeight="bold">Elevator ID</Text>
              <Text fontWeight="bold">Call Status</Text>
              <Text fontWeight="bold">Agent Name</Text>
              <Text fontWeight="bold">Call Time</Text>
              {/* Repeat for each row */}
              {Array.from({ length: 10 }).map((_, index) => (
                <React.Fragment key={index}>
                  <Text>LIFTID10101011987</Text>
                  <Text color="green.500">Ongoing</Text>
                  <Text>Victor Zaar</Text>
                  <Text>12:30 PM</Text>
                </React.Fragment>
              ))}
            </SimpleGrid>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={1} spacing={4} textAlign="center">
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
            <Text fontSize="lg" mb={4} fontWeight="bold" align={'left'}>
              Calls in Last 7 Days
            </Text>
            <Text fontSize="lg" mb={4} fontWeight="bold" align={'left'}>
              1320 Calls
            </Text>
            {/* Placeholder for graph */}
            {/* <Box height="150px" bg="blue.50" /> */}
            {/* <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data} fill="green" barSize={20} radius={[10, 10, 0, 0]} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="calls" />
                <Tooltip />
                <Bar dataKey="calls" fill="green" />
              </BarChart>
            </ResponsiveContainer> */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <defs>
                  <linearGradient
                    id="gradientColor"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#6DBE45" stopOpacity={1} />
                    <stop offset="100%" stopColor="#A5D65D" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="calls" />
                {/* <YAxis /> */}
                <Tooltip />
                <Bar
                  dataKey="calls"
                  fill="url(#gradientColor)" // Use gradient color
                  barSize={20}
                  radius={[10, 10, 0, 0]} // Round the top corners
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
            <Text fontSize="lg" mb={4} fontWeight="bold">
              SOS Elevator Information
            </Text>
            <Text mb={2}>Elevator ID: LIFTID10101011987</Text>
            <Text mb={2}>
              Address: 1800 Orleans St, Baltimore, MD, 21287, United States
            </Text>
            {/* Placeholder for map */}
            {/* <Box height="150px" bg="gray.100">
            <Text textAlign="center" lineHeight="150px" color="gray.500">Map Placeholder</Text>
          </Box> */}
            {/* Embedded Google Map */}
            {/* <Box height="200px" borderRadius="lg" overflow="hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.google.com/maps/embed/v1/place?q=Johns+Hopkins+Hospital,+Baltimore,+MD&key=YOUR_GOOGLE_MAPS_API_KEY"
                title="Google Maps Location"
                allowFullScreen
              ></iframe>
            </Box> */}
            <Box height="200px" borderRadius="lg" overflow="hidden">
              <Image
                //src={gmapImg}
                src={`${process.env.baseUrl}/assets/img/gmap.png`}
                alt="Map"
                objectFit="cover"
                width="100%"
                height="100%"
              />
            </Box>
          </Box>
        </SimpleGrid>
      </SimpleGrid>
      {/* Calls in Last 7 Days */}

      <SimpleGrid columns={2} spacing={8}>
        {/* Elevator SOS Information */}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
