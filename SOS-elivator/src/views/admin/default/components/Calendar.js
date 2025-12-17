// import React, { useState } from 'react';
// import { Box, Select, Text, Grid } from '@chakra-ui/react';

// const Calendar = () => {
//   // Define an array with all months
//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   // Get the current date details
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const currentMonth = today.getMonth();
//   const currentDay = today.getDate();

//   // Generate years from 2001 to currentYear + 5
//   const years = Array.from({ length: currentYear - 2001 + 1 + 5 }, (_, i) => 2001 + i);

//   // State to manage selected month, year, and day
//   const [month, setMonth] = useState(currentMonth);
//   const [year, setYear] = useState(currentYear);
//   const [selectedDay, setSelectedDay] = useState(currentDay);

//   // Days of the week
//   const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

//   // Calculate days in the selected month and year
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   // Render days in the month, with the selected day highlighted
//   const renderDays = () => {
//     return Array.from({ length: daysInMonth }, (_, i) => {
//       const dayNumber = i + 1;
//       const isSelected = dayNumber === selectedDay;

//       return (
//         <Box
//           key={dayNumber}
//           p="2"
//           borderRadius="full"
//           bg={isSelected ? "green.300" : "gray.100"}
//           color={isSelected ? "white" : "black"}
//           fontWeight={isSelected ? "bold" : "normal"}
//           textAlign="center"
//           cursor="pointer"
//           onClick={() => setSelectedDay(dayNumber)}  // Update selected day on click
//         >
//           {dayNumber}
//         </Box>
//       );
//     });
//   };

//   return (
//     <Box width="99%" p="4" boxShadow="md" borderRadius="md" bg="white">
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb="4">
//         <Select 
//           value={month} 
//           onChange={(e) => {
//             setMonth(parseInt(e.target.value));
//             setSelectedDay(null);  // Reset selected day on month change
//           }} 
//           size="sm" 
//           w="100px"
//         >
//           {months.map((m, index) => (
//             <option key={m} value={index}>
//               {m}
//             </option>
//           ))}
//         </Select>
        
//         <Select 
//           value={year} 
//           onChange={(e) => {
//             setYear(parseInt(e.target.value));
//             setSelectedDay(null);  
//           }} 
//           size="sm" 
//           w="100px"
//         >
//           {years.map((y) => (
//             <option key={y} value={y}>
//               {y}
//             </option>
//           ))}
//         </Select>
//       </Box>

//       <Grid templateColumns="repeat(7, 1fr)" gap={2} textAlign="center">
//         {daysOfWeek.map((day) => (
//           <Text key={day} fontWeight="bold" color="gray.600">
//             {day}
//           </Text>
//         ))}
//         {renderDays()}
//       </Grid>
//     </Box>
//   );
// };

// export default Calendar;












import React, { useState, useEffect } from 'react';
import { Box, Select, Text, Grid } from '@chakra-ui/react';

const Calendar = ({ onDateChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const years = Array.from({ length: currentYear - 2001 + 6 }, (_, i) => 2001 + i);

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [startDate, setStartDate] = useState(today); // ✅ today's date as default
  const [endDate, setEndDate] = useState(null);

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const getGridOffset = () => (firstDayOfMonth + 6) % 7;

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // ✅ Call onDateChange with today's date on first load
  useEffect(() => {
    onDateChange?.(formatDate(today), null);
  }, []); // Run once on mount

  const handleDayClick = (day) => {
    const clickedDate = new Date(year, month, day);

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      onDateChange?.(formatDate(clickedDate), null);
    } else if (clickedDate < startDate) {
      setEndDate(startDate);
      setStartDate(clickedDate);
      onDateChange?.(formatDate(clickedDate), formatDate(startDate));
    } else {
      setEndDate(clickedDate);
      onDateChange?.(formatDate(startDate), formatDate(clickedDate));
    }
  };

  const renderDays = () => {
    const offset = getGridOffset();
    const totalCells = offset + daysInMonth;

    return Array.from({ length: totalCells }, (_, i) => {
      if (i < offset) return <Box key={`empty-${i}`} w="40px" h="40px" />;

      const day = i - offset + 1;
      const date = new Date(year, month, day);

      const isStart = startDate && date.toDateString() === startDate.toDateString();
      const isEnd = endDate && date.toDateString() === endDate.toDateString();
      const inRange = startDate && endDate && date > startDate && date < endDate;

      let bg = "transparent";
      let color = "black";
      let borderRadius = "none";

      if (isStart && isEnd) {
        bg = "#00C897";
        color = "red";
        borderRadius = "full";
      } else if (isStart) {
        bg = "#00C897";
        color = "white";
        borderRadius = "45%";
      } else if (isEnd) {
        bg = "#00C897";
        color = "white";
        borderRadius = "45%";
      } else if (inRange) {
        bg = "#E6FAF5";
        color = "green";
      }

      return (
        <Box
          key={day}
          w="40px"
          h="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={bg}
          color={color}
          fontWeight={isStart || isEnd ? "bold" : "normal"}
          borderRadius={borderRadius}
          cursor="pointer"
          onClick={() => handleDayClick(day)}
          transition="all 0.2s"
        >
          {day}
        </Box>
      );
    });
  };

  return (
    <Box width="100%" p="4" boxShadow="md" borderRadius="md" bg="white">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="4">
        <Select
          value={month}
          onChange={(e) => {
            setMonth(parseInt(e.target.value));
            setStartDate(null);
            setEndDate(null);
            onDateChange?.(null, null);
          }}
          size="sm"
          w="100px"
        >
          {months.map((m, index) => (
            <option key={m} value={index}>
              {m}
            </option>
          ))}
        </Select>

        <Select
          value={year}
          onChange={(e) => {
            setYear(parseInt(e.target.value));
            setStartDate(null);
            setEndDate(null);
            onDateChange?.(null, null);
          }}
          size="sm"
          w="100px"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      </Box>

      <Grid templateColumns="repeat(7, 1fr)" gap={0} textAlign="center">
        {daysOfWeek.map((day) => (
          <Text key={day} fontWeight="bold" color="gray.600">
            {day}
          </Text>
        ))}
        {renderDays()}
      </Grid>
    </Box>
  );
};

export default Calendar;



