import React, { useState } from "react";
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
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Drug: React.FC<{ selectedCaseNumber: string }> = ({
  selectedCaseNumber,
}) => {
  const { data, error } = useDrug();
  const [filter, setFilter] = useState("");

  const filteredCaseNo = selectedCaseNumber
    ? data.filter((item) => item.Case_No === selectedCaseNumber)
    : data;

  const filteredDrugs = filter
    ? filteredCaseNo.filter((item) =>
        item.Drug_Name.toLowerCase().includes(filter.toLowerCase())
      )
    : filteredCaseNo;

  const navigate = useNavigate();

  return (
    <>
      <Text
        style={{ color: "black", fontFamily: "Arial", fontSize: "22px" }}
        p="5px"
        bg="#FDEADA"
        align="left"
      >
        Drug records for Case no{" "}
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
              Drug form
            </Th>
            <Th
              style={{ color: "white", fontFamily: "Arial", fontSize: "14px" }}
              width="20%"
            >

              Drug Name
              <Input
                placeholder="Filter by Drug Name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </Th>
            <Th
              style={{ color: "white", fontFamily: "Arial", fontSize: "14px" }}
              width="30%"
            >
              Instruction
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredDrugs.map((item, index) => (
            <Tr key={index}>
              <Td>{item.Case_No}</Td>
              <Td>
                {item.Drug_Dispensed_Date_To
                  ? item.Drug_Dispensed_Date_To.toString()
                  : ""}
              </Td>
              <Td>{item.Drug_Form}</Td>
              <Td>{item.Drug_Name}</Td>
              <Td>{item.Instructions_from_Dispensed}</Td>
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
        onClick={() => navigate("/")}
      >
        Back
      </Button>

      <Button
        colorScheme="teal"
        variant="solid"
        bg="#Ec8646"
        ml="400px"
        mt="30px"
        onClick={() => navigate("/lab")}
      >
        Next
      </Button>
    </>
  );
};

export default Drug;
