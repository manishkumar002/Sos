import React from "react";

// Chakra imports
import { Flex, useColorModeValue, Image } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";
import axiomLogo from 'assets/img/axiom_logo.png'

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      <Image
        src={axiomLogo}
        // src={`${process.env.baseUrl}/assets/img/gmap.png`}
        alt="Home"
        objectFit="cover"
        width="100%"
        height="100%"
      />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
