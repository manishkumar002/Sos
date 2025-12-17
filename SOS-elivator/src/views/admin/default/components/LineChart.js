// import React from 'react';
// import { Box } from '@chakra-ui/react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register components for Chart.js
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const LineChart = () => {
//   const data = {
//     labels: Array.from({ length: 50 }, (_, i) => i + 1), // Example labels
//     datasets: [
//       {
//         label: 'Sample Data',
//         data: [20, 30, 25, 40, 35, 30, 45, 50, 25, 30, 40, 35, 20, 25, 30, 45, 40, 30, 20, 50], // Sample data points
//         borderColor: '#319795', // Chakra teal color
//         backgroundColor: 'rgba(49, 151, 149, 0.2)', // Semi-transparent fill color
//         tension: 0.4, // Smooth curve
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     scales: {
//       x: {
//         display: false, // Hide x-axis for a cleaner look
//       },
//       y: {
//         beginAtZero: true,
//       },
//     },
//     plugins: {
//       legend: {
//         display: false, // Hide legend
//       },
//     },
//   };

//   return (
//     <Box bg="white" p={6} boxShadow="md" borderRadius="lg" maxW="lg" mx="auto">
//       <Line data={data} options={options} />
//     </Box>
//   );
// };

// export default LineChart;

import React from 'react';
import { Box, Text, Flex, IconButton, Select } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const LineChart = ({ year, setYear, chartData, title,  totalCount = 0 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#A0AEC0', font: { weight: '600' } }, grid: { display: false } },
      y: {
        ticks: { color: '#CBD5E0', font: { size: 12 } },
        grid: { color: '#F0F0F0', drawTicks: false },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#89c4e2',
        titleColor: '#red',
        bodyColor: '#fff',
        displayColors: false,
        callbacks: {
          title: () => '',
          label: context => `${title} ${context.raw}`,
        },
      },
    },
    elements: { line: { borderWidth: 3 } },
  };

  return (
    <Box bg="white" p={6} boxShadow="lg" borderRadius="lg" w="100%" maxW="5xl" mx="auto">
      <Flex justify="space-between" align="center" mb={4}>
        <Select value={year} onChange={(e) => setYear(e.target.value)} w="130px" fontWeight="bold" fontSize="sm">
        <option>2021</option>
          <option>2022</option>
          <option>2023</option>
          <option>2024</option>
          <option>2025</option>
          <option>2026</option>
          <option>2027</option>
          <option>2028</option>
          <option>2029</option>
          <option>2030</option>
        </Select>
        <IconButton aria-label="Chart icon" variant="ghost" />
      </Flex>

      <Flex gap={10} align="center" direction={['column', 'row']}>
        <Box minW="140px">
        <Text fontSize="xl" fontWeight="bold" color="gray.800">{title}</Text>
          <Text fontSize="5xl" fontWeight="bold" color="gray.800">{totalCount}</Text>
        </Box>
        <Box flex="1" h="280px">
          <Line data={chartData} options={options} />
        </Box>
      </Flex>
    </Box>
  );
};

export default LineChart;




