import React from 'react';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from 'react-router-dom';

import { Icon } from '@chakra-ui/react';
import {
  MdCall,
  MdCallEnd,
  MdHome,
  MdLock,
  MdOutlineElevator,
  MdElevator,
  MdOutlineAssignment,
  MdSupervisorAccount,
  MdSupervisedUserCircle,
  MdArchitecture,
  MdSpeakerNotes,
} from 'react-icons/md';
// Auth Imports
import SignInCentered from 'views/auth/signIn';
import ForgotPassword from 'views/auth/ForgotPassword';
import NewsubmitPassword from 'views/auth/NewsubmitPassword';
import FinishedCall from 'views/admin/default/components/FinishedCall';
import ActiveCall from 'views/admin/default/components/ActiveCall';
import DashboardPage from 'views/admin/default/components/DashboardPage';
import Elevators from 'views/admin/default/components/Elevators';
import ElevatorsStatus from 'views/admin/default/components/ElevatorsStatus';
import ManageAgent from 'views/admin/default/components/ManageAgent';
import ManageUser from 'views/admin/default/components/ManageUser';
import ManageTechnician from 'views/admin/default/components/ManageTechnician';
import Reports from 'views/admin/default/components/Reports';
import Notes from 'views/admin/default/components/Notes';
import DemoCalling from 'views/admin/default/components/DemoCalling';
import WaitingCalls from 'views/admin/default/components/WaitingCalls';
import AgentNotes from 'views/admin/default/components/AgentNotes';
import TechnicianList from 'views/admin/default/components/TechnicianList';
import Profile from 'views/admin/default/components/Profile';
//const isUserLoggedIn = true;
//const aunthicatedStatus = localStorage.getItem('authenticated');

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <DashboardPage />,
  },
  {
    name: 'Waiting calls',
    layout: '/admin',
    path: '/waitingcall',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <WaitingCalls />,
  },
  {
    name: 'Active Calls',
    layout: '/admin',
    icon: <Icon as={MdCall} width="20px" height="20px" color="inherit" />,
    path: '/activecall',
    component: <ActiveCall />,
  },
  {
    name: 'Finished Calls',
    layout: '/admin',
    icon: <Icon as={MdCallEnd} width="20px" height="20px" color="inherit" />,
    path: '/finishedcall',
    component: <FinishedCall />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
  {
    name: 'New submit Password',
    layout: '/auth',
    path: '/confirm-password',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <NewsubmitPassword />,
  },
  {
    name: 'Forgot Password',
    layout: '/auth',
    path: '/forgot-password',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <ForgotPassword />,
  },
  {
    name: 'Elevators',
    layout: '/admin',
    path: '/elevators',
    icon: (
      <Icon as={MdOutlineElevator} width="20px" height="20px" color="inherit" />
    ),
    component: <Elevators />,
  },
  {
    name: 'Elevators Status',
    layout: '/admin',
    path: '/elevator-status',
    // icon: <Icon as={MdElevator} width="20px" height="20px" color="inherit" />,
    component: <ElevatorsStatus />,
  },
  {
    name: 'Manage Agent',
    layout: '/admin',
    path: '/manage-agent',
    icon: (
      <Icon
        as={MdSupervisorAccount}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <ManageAgent />,
  },
  {
    name: 'Manage User',
    layout: '/admin',
    path: '/manage-user',
    icon: (
      <Icon
        as={MdSupervisedUserCircle}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <ManageUser />,
  },
  {
    name: 'Manage Technician',
    layout: '/admin',
    path: '/manage-technician',
    icon: (
      <Icon as={MdArchitecture} width="20px" height="20px" color="inherit" />
    ),
    component: <ManageTechnician />,
  },
  {
    name: 'Technician List',
    layout: '/admin',
    path: '/technician-list',
    icon: (
      <Icon as={MdArchitecture} width="20px" height="20px" color="inherit" />
    ),
    component: <TechnicianList />,
  },

  {
    name: 'Reports',
    layout: '/admin',
    path: '/reports',
    icon: (
      <Icon
        as={MdOutlineAssignment}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <Reports />,
  },
  {
    name: 'Notes',
    layout: '/admin',
    path: '/notes',
    icon: (
      <Icon as={MdSpeakerNotes} width="20px" height="20px" color="inherit" />
    ),
    component: <Notes />,
  },

  {
    name: 'Notes',
    layout: '/admin',
    path: '/agent-notes',
    icon: (
      <Icon as={MdSpeakerNotes} width="20px" height="20px" color="inherit" />
    ),
    component: <AgentNotes />,
  },

  {
    name: 'DemoCalling',
    layout: '/admin',
    path: '/calling',
    icon: (
      <Icon as={MdSpeakerNotes} width="20px" height="20px" color="inherit" />
    ),
    component: <DemoCalling />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: (
      <Icon as={MdSpeakerNotes} width="20px" height="20px" color="inherit" />
    ),
    component: <Profile />,
  },
];

export default routes;
