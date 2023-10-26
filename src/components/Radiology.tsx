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
import useRadiology from "../hooks/useRadiology";
import { length } from "list";

const Radiology: React.FC<{ selectedCaseNumber: string }> = ({
  selectedCaseNumber,
}) => {
  const { data, error } = useRadiology();
  const filteredCaseNo = selectedCaseNumber
    ? data.filter((item) => item.Case_No === selectedCaseNumber)
    : data;

  const filteredRadio = filteredCaseNo.filter(
    (item) => item.Report_cleaned !== ""
  );

  const navigate = useNavigate();

  return (
    <>
      <Text
        style={{ color: "black", fontFamily: "Arial", fontSize: "22px" }}
        p="5px"
        bg="#FDEADA"
        align="left"
      >
        Radiology records for Case no{" "}
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
              Order Name
            </Th>
            <Th
              style={{ color: "white", fontFamily: "Arial", fontSize: "14px" }}
              width="20%"
            >
              Procedure Name
            </Th>
            <Th
              style={{ color: "white", fontFamily: "Arial", fontSize: "14px" }}
              width="30%"
            >
              Result
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredCaseNo.map((item, index) => (
            <Tr key={index}>
              <Td>{item.Case_No}</Td>
              <Td>{item.Exam_Start_Date.toString()}</Td>
              <Td>{item.Order_Name}</Td>
              <Td>{item.Procedure_Name}</Td>
              <Td>{item.Report_cleaned}</Td>
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
        onClick={() => navigate("/lab")}
      >
        Back
      </Button>

      <Button
        colorScheme="teal"
        variant="solid"
        bg="#Ec8646"
        ml="400px"
        mt="30px"
        onClick={() => navigate("/report")}
      >
        Next
      </Button>
    </>
  );
};

export default Radiology;
