import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import logo from "../assets/singhealth-logo.png";
import divide from "../assets/shs-divider.png";
import { Divider } from "@chakra-ui/react";

const NavBar = () => {
  return (
    <>
      <HStack mb="15px" height="50px">
        <Image src={logo} width="150px" height="120px" pt="30px" />
        <Text
          fontSize="3xl"
          fontWeight="bold"
          pt="50px"
          pl="300px"
          color="#E54809"
        >
          SingHealth medical report generator
        </Text>
      </HStack>
      <Text>.</Text>
      <Image src={divide} width="1900px" height="10px" />
    </>
  );
};

export default NavBar;
