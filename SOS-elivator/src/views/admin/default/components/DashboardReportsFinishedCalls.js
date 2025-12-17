

import React, { useState, useEffect } from 'react';
import {
  Box, SimpleGrid, Text, Image, Button, Input, FormControl, Checkbox, InputGroup, Icon,
  InputLeftElement, Select, useToast
} from '@chakra-ui/react';
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
import reportImg from 'assets/img/sidebarmenu/elevators.png';
import reportImgSel from 'assets/img/sidebarmenu/elevatorImgSel.png';
import Calendar from './Calendar';
const DashboardReportsFinishedCalls = ({ setReportsCounts }) => {
  const titleHeighlited = '#0F405B';
  const titlecolor = '#A3AED0';

  // State to store the selected Lift ID
  //const [selectedLiftId, setSelectedLiftId] = useState('LIFTID10101011987');


  const [formMode, setFormMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false); // To toggle delete mode
  const [reports, setReports] = useState([

  ]);
  const [elevatorId, setElevatorId] = useState('')
  const [startDate,setStartDate]=useState('')
  const[endDate,setEndDate]=useState('')

  const [selectedLiftId, setSelectedLiftId] = useState(reports[0]?.id); // Default to the first row
  const [selectedReport, setSelectedReport] = useState(reports[0]);

  // Handle row click to set active row
  const handleRowClick = (report) => {
    setSelectedLiftId(report?.id);
    setSelectedReport(report); // Update the selected report
  };

  useEffect(() => {
    fetchFinishedCall();
  }, [startDate, endDate]);

  const fetchFinishedCall = async (startDate, endDate) => {
    try {
      const response = await fetch(`${config.SOS_elivator}/callLists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send empty object or filters if needed
        body: JSON.stringify({ elevatorId,startDate,endDate }), // Add filters if required
      });

      const result = await response.json();
      const data = result.callLists || [];

      const FinishedCall = data.filter(
        (calls) => calls.call_status?.trim().toLowerCase() === 'finished'
      );

      const Finished = FinishedCall.length;
      console.log(Finished, "Filtered Finished Calls");

      if (setReportsCounts) {
        setReportsCounts({
          Finished,
        });
      }

      setReports(FinishedCall);

      if (FinishedCall.length > 0) {
        setSelectedLiftId(FinishedCall[0].id);
        setSelectedReport(FinishedCall[0]);
      }
    } catch (error) {
      console.error('Failed to fetch elevators:', error);
    }
  };


const handleDateChange = (startDate, endDate) => {
  if (startDate && endDate) {
    fetchFinishedCall(startDate, endDate);
  } else {
    fetchFinishedCall();
  }
};

// Search button handler
const handleSearchClick = () => {
  fetchFinishedCall(startDate, endDate);
};

  const [year, setYear] = useState('2025');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.SOS_elivator}/getMonthlyFinished`, {
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
                    title="Finished Calls"
                  />{/* Display the line chart */}
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
                                value={elevatorId}
                                onChange={(e) => setElevatorId(e.target.value)}
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
        <SimpleGrid columns={1} spacing={4} textAlign="center" style={{ marginRight: '20px' }}>
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={0} w="100%">
            <Text fontSize={{ base: '18px', md: '20px' }} mb={8} fontWeight="bold" className="callsHeaderTitle">
              Finished Calls
            </Text>
            <Box>
              <ul style={{ display: 'grid', gridTemplateColumns: '33.33% 33.33% 33.33%', fontWeight: 'bold', height: '40px' }}>
                <li className="callsHeaderTitle">Elevator ID</li>
                <li className="callsHeaderTitle">Agent Name</li>
                <li className="callsHeaderTitle">Call Date</li>
              </ul>
              {reports.map((report, index) => (
                <ul
                  key={report.id}
                  onClick={() => handleRowClick(report)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '33.33% 33.33% 33.33%',
                    cursor: 'pointer',
                    //backgroundColor: report.id === selectedLiftId ? '#d0e1ff' : index % 2 === 0 ? 'white' : '#f9f9f9',
                  }}
                  //className={report.id === selectedLiftId ? 'active-row' : ''} // Add active class if selected
                  className={report.id === selectedLiftId ? 'lift-row selected' : 'lift-row'} // Add active class if selected
                >
                  <li>{report.lift_id}</li>
                  <li>{report.agent?.name}</li>
                  <li>{new Date(report.timestamp).toLocaleDateString('en-GB')}</li>

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

export default DashboardReportsFinishedCalls;
