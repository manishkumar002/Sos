import React, { useState, useEffect } from 'react';

// chakra imports
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';

import { Scrollbars } from 'react-custom-scrollbars-2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Image } from '@chakra-ui/react';

// Component Imports
import DashboardPage from 'views/admin/default/components/DashboardPage';
import ActiveCall from 'views/admin/default/components/ActiveCall';
import FinishedCall from 'views/admin/default/components/FinishedCall';
import Elevators from 'views/admin/default/components/Elevators';
import ElevatorsStatus from 'views/admin/default/components/ElevatorsStatus';
import ManageAgent from 'views/admin/default/components/ManageAgent';
import ManageUser from 'views/admin/default/components/ManageUser';
import ManageTechnician from 'views/admin/default/components/ManageTechnician';
import TechnicianList from 'views/admin/default/components/TechnicianList';
import Reports from 'views/admin/default/components/Reports';
import Notes from 'views/admin/default/components/Notes';
import DemoCalling from 'views/admin/default/components/DemoCalling';
import WaitingCalls from 'views/admin/default/components/WaitingCalls';
import AgentNotes from 'views/admin/default/components/AgentNotes';

import logo from 'assets/img/axiom_logo.png';
import dashboardImg from 'assets/img/sidebarmenu/dashboardImg.png';
import dashboardImgSel from 'assets/img/sidebarmenu/dashboardImgSel.png';
import activecallImg from 'assets/img/sidebarmenu/activecallImg.png';
import activecallImgSel from 'assets/img/sidebarmenu/activecallImgSel.png';
import finishedcallImg from 'assets/img/sidebarmenu/finishedcallImg.png';
import finishedcallImgSel from 'assets/img/sidebarmenu/finishedcallImgSel.png';
import elevatorImg from 'assets/img/sidebarmenu/elevators.png';
import elevatorImgSel from 'assets/img/sidebarmenu/elevatorImgSel.png';
import elevatorStatusImg from 'assets/img/sidebarmenu/elevatorStatusImg.png';
import elevatorStatusImgSel from 'assets/img/sidebarmenu/elevatorStatusImgSel.png';
import ManageAgentImg from 'assets/img/sidebarmenu/managentAgentImg.png';
import ManageAgentImgSel from 'assets/img/sidebarmenu/ManageAgentImgSel.png';
import manageUserImg from 'assets/img/sidebarmenu/manageUserImg.png';
import manageUserImgSel from 'assets/img/sidebarmenu/manageUserImgSel.png';
import ManageTechnicianImg from 'assets/img/sidebarmenu/manageTechnicianImg.png';
import ManageTechnicianImgSel from 'assets/img/sidebarmenu/ManageTechnicianImgSel.png';
import reportsImg from 'assets/img/sidebarmenu/reportsImg.png';
import reportsImgSel from 'assets/img/sidebarmenu/reportsImgSel.png';
import notesImg from 'assets/img/sidebarmenu/notesImg.png';
import notesImgSel from 'assets/img/sidebarmenu/notesImgSel.png';

// Routes Definition
const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: {
      default: dashboardImg, // Default image
      selected: dashboardImgSel, // Selected image
    },
    component: <DashboardPage />,
    roles: ['superadmin', 'user'],
  },

  {
    name: 'Waiting calls',
    layout: '/admin',
    icon: {
      default: activecallImg, // Default image
      selected: activecallImgSel, // Selected image
    },
    path: '/waitingcall',
    component: <WaitingCalls />,
    roles: ['agent'],
  },
  {
    name: 'Active Calls',
    layout: '/admin',
    icon: {
      default: activecallImg, // Default image
      selected: activecallImgSel, // Selected image
    },
    path: '/activecall',
    component: <ActiveCall />,
    roles: ['superadmin', 'agent', 'user'],
  },
  {
    name: 'Finished Calls',
    layout: '/admin',
    icon: {
      default: finishedcallImg, // Default image
      selected: finishedcallImgSel, // Selected image
    },
    path: '/finishedcall',
    component: <FinishedCall />,
    roles: ['superadmin', 'agent', 'user'],
  },
  {
    name: 'Elevators',
    layout: '/admin',
    icon: {
      default: elevatorImg, // Default image
      selected: elevatorImgSel, // Selected image
    },
    path: '/elevators',
    component: <Elevators />,
    roles: ['superadmin', 'user'],
  },
  {
    name: 'Elevators Status',
    layout: '/admin',
    path: '/elevator-status',
    icon: {
      default: elevatorStatusImg, // Default image
      selected: elevatorStatusImgSel, // Selected image
    },
    component: <ElevatorsStatus />,
    roles: ['superadmin', 'agent'],
  },
  {
    name: 'Manage Agent',
    layout: '/admin',
    path: '/manage-agent',
    icon: {
      default: ManageAgentImg, // Default image
      selected: ManageAgentImgSel, // Selected image
    },
    component: <ManageAgent />,
    roles: ['superadmin', 'user'],
  },
  {
    name: 'Manage User',
    layout: '/admin',
    path: '/manage-user',
    icon: {
      default: manageUserImg, // Default image
      selected: manageUserImgSel, // Selected image
    },
    component: <ManageUser />,
    roles: ['superadmin'],
  },
  {
    name: 'Manage Technician',
    layout: '/admin',
    path: '/manage-technician',
    icon: {
      default: ManageTechnicianImg, // Default image
      selected: ManageTechnicianImgSel, // Selected image
    },
    component: <ManageTechnician />,
    roles: ['agent'],
  },
  {
    name: 'Technician List',
    layout: '/admin',
    path: '/technician-list',
    icon: {
      default: ManageTechnicianImg, // Default image
      selected: ManageTechnicianImgSel, // Selected image
    },
    component: <TechnicianList />,
    roles: ['superadmin'],
  },
  {
    name: 'Reports',
    layout: '/admin',
    path: '/reports',
    icon: {
      default: reportsImg, // Default image
      selected: reportsImgSel, // Selected image
    },
    component: <Reports />,
    roles: ['superadmin', 'user'],
  },
  {
    name: 'Notes',
    layout: '/admin',
    path: '/notes',
    icon: {
      default: notesImg, // Default image
      selected: notesImgSel, // Selected image
    },
    component: <Notes />,
    roles: ['superadmin'],
  },

  {
    name: 'Notes',
    layout: '/admin',
    path: '/agent-notes',
    icon: {
      default: notesImg, // Default image
      selected: notesImgSel, // Selected image
    },
    component: <AgentNotes />,
    roles: ['agent'],
  },
  {
    name: 'Calling',
    layout: '/admin',
    path: '/calling',
    icon: {
      default: notesImg, // Default image
      selected: notesImgSel, // Selected image
    },
    component: <DemoCalling />,
    roles: ['user'],
  },
  // {
  //   name: 'AgentRecevcall',
  //   layout: '/admin',
  //   path: '/agent-receive',
  //   icon: {
  //     default: notesImg, // Default image
  //     selected: notesImgSel, // Selected image
  //   },
  //   component: <AgentRecevcall />,
  //   roles: ['agent'],
  // },
];

const Sidebar = () => {
  const navigate = useNavigate(); // Use navigate hook
  const [selectedRoute, setSelectedRoute] = useState('/default'); // Set initial route
  const [role, setRole] = useState(null); // State to store the role of the user

  useEffect(() => {
    // Fetch the role from localStorage (You can change this logic based on how you're storing the role)
    const userRole = localStorage.getItem('role'); // Assuming the role is stored as 'role'
    //const userRole = localStorage.setItem('role', role);
    setRole(userRole);
  }, []);

  let variantChange = '0.2s linear';
  let shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );
  let sidebarBg = useColorModeValue('white', 'white');
  let sidebarMargins = '0px';

  // Filter routes based on the user role
  const filteredRoutes = routes.filter((route) => route.roles.includes(role));

  // Function to render the appropriate icon based on the selected route
  const renderIcon = (route) => {
    const iconSrc =
      selectedRoute === route.path ? route.icon.selected : route.icon.default;
    return (
      <Image
        src={iconSrc}
        width="20px"
        height="20px"
        alt={route.name} // Always include alt text for accessibility
      />
    );
  };

  return (
    <Box
      display={{ sm: 'none', xl: 'block' }}
      w="100%"
      position="fixed"
      minH="100%"
    >
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="100vh"
        m={sidebarMargins}
        minH="100%"
        overflowX="hidden"
        overflowY={'hidden'}
        boxShadow={shadow}
      >
        <Flex justifyContent="center" py="20px">
          <Image src={logo} alt="Logo" width="200px" height="auto" />
        </Flex>

        <Scrollbars autoHide>
          {filteredRoutes.map((route, index) => (
            <Flex
              key={index}
              align="center"
              p="12px"
              cursor="pointer"
              onClick={() => {
                setSelectedRoute(route.path);
                navigate(route.layout + route.path); // Navigate to the selected route
              }}
              bg="transparent"
              fontWeight={selectedRoute === route.path ? 'bold' : 'normal'}
              color={selectedRoute === route.path ? '#2B3D49' : 'gray.600'}
            >
              {renderIcon(route)} {/* Conditionally render the icon */}
              <Box ml="12px">{route.name}</Box>
            </Flex>
          ))}
        </Scrollbars>
      </Box>
    </Box>
  );
};

export default Sidebar;
