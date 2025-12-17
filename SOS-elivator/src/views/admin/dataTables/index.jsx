/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/dataTables/components/DevelopmentTable";
import CheckTable from "views/admin/dataTables/components/CheckTable";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/dataTables/variables/columnsData";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import React from "react";
import {Flex, Text, Icon, Input, Button } from "@chakra-ui/react";

export default function Settings() {
  // Chakra Color Mode
  //alert('++++++++');
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={1} spacing={4} textAlign="center">
            <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={8} width="">
              <Text fontSize="lg" mb={4} fontWeight="bold">Active Calls</Text>
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
      {/* <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        />
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <ColumnsTable
          columnsData={columnsDataColumns}
          tableData={tableDataColumns}
        />
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
      </SimpleGrid> */}
    </Box>
  );
}
