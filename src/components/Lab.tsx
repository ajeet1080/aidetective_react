import React from "react";
import useDrug from "../hooks/useDrug";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  ListItem,
  UnorderedList,
  Select,
  useConst,
  Button,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useLab from "../hooks/useLab";

const Lab: React.FC<{ selectedCaseNumber: string }> = ({
  selectedCaseNumber,
}) => {
  const { data, error } = useLab();
  const filteredCaseNo = selectedCaseNumber
    ? data.filter((item) => item.Case_No === selectedCaseNumber)
    : data;

  const navigate = useNavigate();

  return (
    <>
      <Text
        style={{ color: "black", fontFamily: "Arial", fontSize: "22px" }}
        p="5px"
        bg="#FDEADA"
        align="left"
      >
        Lab records for Case no{" "}
        <Text
          as="span"
          style={{ color: "black", fontSize: "22px", fontWeight: "bold" }}
        >
          {" "}
          {selectedCaseNumber}{" "}
        </Text>
      </Text>
      <Table variant="simple" size="md" p="30px">
        <Thead bg="#E54809">
          <Tr>
            <Th
              style={{ color: "white", fontFamily: "Arial", fontSize: "14px" }}
              width="5%"
            >
              Case No
            </Th>
            <Th
              style={{ color: "white", fontFamily: "Arial", fontSize: "14px" }}
              width="10%"
            >
              Date
            </Th>
            <Th
              style={{ color: "white", fontFamily: "Arial", fontSize: "14px" }}
              width="10%"
            >
              Test name
            </Th>
            <Th
              style={{ color: "white", fontFamily: "Arial", fontSize: "14px" }}
              width="20%"
            >
              Result
            </Th>
            <Th
              style={{ color: "white", fontFamily: "Arial", fontSize: "14px" }}
              width="30%"
            >
              Reference
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredCaseNo.map((item, index) => (
            <Tr key={index}>
              <Td>{item.Case_No}</Td>
              <Td>{item.Reported_Date.toString()}</Td>
              <Td>{item.Lab_Test_Description}</Td>
              <Td>
                {item.Result_Value} {item.Units_of_Measurement}
              </Td>
              <Td>
                {item.Reference_Ranges} {item.Units_of_Measurement}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button
        colorScheme="teal"
        variant="solid"
        bg="#Ec8646"
        ml="200px"
        mt="30px"
        onClick={() => navigate("/drugs")}
      >
        Back
      </Button>

      <Button
        colorScheme="teal"
        variant="solid"
        bg="#Ec8646"
        ml="400px"
        mt="30px"
        onClick={() => navigate("/radiology")}
      >
        Next
      </Button>
    </>
  );
};

export default Lab;
