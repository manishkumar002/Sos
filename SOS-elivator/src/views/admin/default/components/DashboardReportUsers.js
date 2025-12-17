

import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Text, Image, Button, Input, FormControl, Checkbox, InputGroup, Icon,
  InputLeftElement, Select, useToast} from '@chakra-ui/react';
import {
    MdCall,
    MdCallEnd,
    MdAddCall,
    MdOutlineSearch,
  } from 'react-icons/md';
  import LineChart from './LineChart';
  import config from 'config/config';
import gmapImg from 'assets/img/gmap.png';
import DashboardHeader from './DashboardHeader';
import DashboardActiveCallBar from './DashboardActiveCallBar';
import reportImg from  'assets/img/sidebarmenu/elevators.png';
import reportImgSel from  'assets/img/sidebarmenu/elevatorImgSel.png';
import Calendar from './Calendar';
const DashboardReportUsers = () => {
  const titleHeighlited = '#0F405B';
  const titlecolor = '#A3AED0';

  // State to store the selected Lift ID
  //const [selectedLiftId, setSelectedLiftId] = useState('LIFTID10101011987');
  
  const [reports, setReports] = useState([
    
  ]);
   const [userId, setUserId] = useState('')
     const [startDate,setStartDate]=useState('')
     const[endDate,setEndDate]=useState('')

  const [selectedLiftId, setSelectedLiftId] = useState(reports[0]?.id); // Default to the first row
  const [selectedReport, setSelectedReport] = useState(reports[0]);

  // Handle row click to set active row
const handleRowClick = (report) => {
  setSelectedLiftId(report?.id);
  setSelectedReport(report); // Update the selected report
};



 const fetchUsers = async (startDate, endDate) => {
  try {
    const response = await fetch(`${config.SOS_elivator}/allUsers`, {
      method: 'POST', // Use POST method
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({userId,startDate, endDate}) 
    });

    const data = await response.json();
    console.log(data);

    if (Array.isArray(data)) {
      setReports(data); 

      if (data.length > 0) {
        setSelectedLiftId(data[0].id);
      }
    } else {
      console.error('Fetched data is not an array:', data);
      setReports([]); 
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

  useEffect(() => {
    fetchUsers();
  }, [startDate, endDate]);



const handleDateChange = (startDate, endDate) => {
  if (startDate && endDate) {
    fetchUsers(startDate, endDate);
  } else {
    fetchUsers();
  }
};

// Search button handler
const handleSearchClick = () => {
  fetchUsers(startDate, endDate);
};

  const [year, setYear] = useState('2025');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.SOS_elivator}/getMonthlyCountUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ year }),
        });
        const data = await response.json();
        const months = data.data.map(item => item.month);
        const counts = data.data.map(item => item.count);
        setTotal(counts.reduce((a, b) => a + b, 0));
        setChartData({
          labels: months,
          datasets: [{
            data: counts,
            borderColor: '#3182CE',
            backgroundColor: 'rgba(49, 130, 206, 0.1)',
          }],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [year]);




  return (
    <SimpleGrid > 
      {/* **********************reports Listing*************************************** */}
      <SimpleGrid
      columns={{ base: 1, md: 2 }} // Responsive columns
      spacing={4}
      textAlign="left"
      mb={0}
      ml={3}
      mr={-4}
    
      gridTemplateColumns={{ base: '100%', md: '65% 35%' }} // Adjusts the grid layout for mobile
    >
      {/* Left column start from here */}
      <SimpleGrid columns={1} spacing={4} textAlign="left" id="reportListingBox">
        <SimpleGrid columns={1} spacing={4} textAlign="center" >
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={0} w="100%">
  

          <SimpleGrid>
              {/* Chart Section */}
              {/* Placeholder for Chart */}
              <Text fontSize="2xl" fontWeight="bold" color="teal.500" >Chart</Text>
              {/* Here you would insert your chart component */}
              <Box mt={8}>
              <LineChart
                 year={year}
                 setYear={setYear}
                 chartData={chartData}
                 totalCount={total}
                 title="Users"
                /> {/* Display the line chart */}
              </Box>
            </SimpleGrid>
            
            {/* <DashboardActiveCallBar /> */}
          </Box>

          <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              spacing={4}
              textAlign="center"
            >
              {/* calendar starts from here */}
              <SimpleGrid columns={1} spacing={4} textAlign="left">
               <Calendar onDateChange={handleDateChange} />
              </SimpleGrid>
              {/* calendar ends here */}
              
              {/* Custom search starts here */}
              <SimpleGrid columns={1} spacing={4} textAlign="center">
                <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={0}>
                  <Text
                    fontSize={{ base: '18px', md: '20px' }}
                    mb={1}
                    fontWeight="bold"
                    color={titleHeighlited}
                    align={'left'}
                  >
                    Custom Search
                  </Text>
                  

                  <SimpleGrid
                  columns={{ base: 3, sm: 2, md: 1 }}
                  spacing={4}
                  mb={0}
                  ml={2}
                >
                  
                  <Box bg="white" p={0} borderRadius="0px">

                    <SimpleGrid
                        columns={{ base: 1, md: 2 }}
                        spacing={4}
                        gridTemplateColumns={{ base: '1fr', md: '49% 49%' }} 
                      >
                        
                        <Box>
                        <Text
                          mb={2}
                          align={'left'}
                        >
                          <span style={{ fontSize: '14px', color: titlecolor }}>Custom Search By ID</span>
                        </Text>
                        </Box>

                        <Box>
                        <Text
                          mb={2}
                          align={'left'}
                        >
                          <span style={{ fontSize: '14px', color: titlecolor }}>Custom Search By Time Period</span>
                        </Text>
                        </Box>
                      </SimpleGrid>

                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      spacing={4}
                      gridTemplateColumns={{ base: '1fr', md: '49% 49%' }} 
                    >
                      
                      <Box>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<MdOutlineSearch color="#0F405B" />}
                            p="-5"
                          />
                          <Input
                            placeholder="Agent ID"
                            borderRadius="25px"
                            bg="#F4F7FE"
                            height="40px"
                            fontSize="14px"
                          />
                        </InputGroup>
                      </Box>

                      <Box>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<MdOutlineSearch color="#0F405B" />}
                          />
                          <Input
                            placeholder="Start Date (DD/MM/YYYY)"
                            borderRadius="25px"
                            bg="#F4F7FE"
                            height="40px"
                            fontSize="14px"
                              type='date'
                             value={startDate}
                                 onChange={(e) => setStartDate(e.target.value)}
                          />
                        </InputGroup>
                      </Box>
                    </SimpleGrid>

                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      spacing={4}
                      gridTemplateColumns={{ base: '1fr', md: '49% 49%' }} 
                      pt="5"
                    >
                      <Box>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<MdOutlineSearch color="#0F405B" />}
                            p="-5"
                          />
                          <Input
                            placeholder="User ID"
                            borderRadius="25px"
                            bg="#F4F7FE"
                            height="40px"
                            fontSize="14px"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}

                          />
                        </InputGroup>
                      </Box>

                      <Box>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<MdOutlineSearch color="#0F405B" />}
                          />
                          <Input
                            placeholder="End Date (DD/MM/YYYY)"
                            borderRadius="25px"
                            bg="#F4F7FE"
                            height="40px"
                            fontSize="14px"
                              type='date'
                             value={endDate}
                                 onChange={(e) => setEndDate(e.target.value)}
                          />
                        </InputGroup>
                      </Box>
                    </SimpleGrid>

                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      spacing={4}
                      gridTemplateColumns={{ base: '1fr', md: '49% 49%' }} 
                      pt="5"
                    >
                      <Box>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            children={<MdOutlineSearch color="#0F405B" />}
                            p="-5"
                          />
                          <Input
                            placeholder="Elevator ID"
                            borderRadius="25px"
                            bg="#F4F7FE"
                            height="40px"
                            fontSize="14px"
                          />
                        </InputGroup>
                      </Box>
                      <Box>&nbsp;</Box>
                    </SimpleGrid>

                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      spacing={4}
                      gridTemplateColumns={{ base: '1fr', md: '49% 49%' }} 
                      pt="5"
                    >
                      <Box>
                        <Button
                          colorScheme="teal"
                          width="100%" // Full width on mobile
                          height="40px"
                          borderRadius="25px"
                          bg="#0F405B"
                          color="white"
                          fontSize="14px"
                          _hover={{ bg: 'blue.600' }}
                          onClick={handleSearchClick}
                        >
                          Search
                        </Button>
                      </Box>

                      <Box>&nbsp;</Box>
                    </SimpleGrid>

                  </Box>
                </SimpleGrid>
                </Box>
              </SimpleGrid>
              {/* Custom search ends here */}
            </SimpleGrid>
          </Box>

        </SimpleGrid>
      </SimpleGrid>
      {/* Left column end here */}

      {/* right column start from here */}
      <SimpleGrid columns={1} spacing={4} textAlign="center" style={{marginRight:'20px'}}>
        <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={0} w="100%">
          <Text fontSize={{ base: '18px', md: '20px' }} mb={8} fontWeight="bold" className="callsHeaderTitle">
       Users       
          </Text>
            <Box>
              <ul style={{ display: 'grid', gridTemplateColumns: '20.33% 45.33% 40.33%', fontWeight: 'bold', height: '40px' }}>
                <li className="callsHeaderTitle">ID</li>
                <li className="callsHeaderTitle">User Name</li>
                <li className="callsHeaderTitle">Address</li>
              </ul>
              {reports.map((report, index) => (
                <ul
                key={report.id}
                onClick={() => handleRowClick(report)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '18.33% 30.33% 53.33%',
                  cursor: 'pointer',
                  //backgroundColor: report.id === selectedLiftId ? '#d0e1ff' : index % 2 === 0 ? 'white' : '#f9f9f9',
                }}
                //className={report.id === selectedLiftId ? 'active-row' : ''} // Add active class if selected
                className={report.id === selectedLiftId ? 'lift-row selected' : 'lift-row'} // Add active class if selected
              >
                <li>{report.unique_id}</li>
                <li>{report.name}</li>
                <li>{report.location}</li>

              </ul>
              ))}
            </Box>       
        </Box>
        </SimpleGrid>
        {/* right column ends here */}

      
    </SimpleGrid>

    </SimpleGrid>
  );
};

export default DashboardReportUsers;
