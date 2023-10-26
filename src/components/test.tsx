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
import { useState, ChangeEvent } from "react";
import useClinicalDoc from "../hooks/useClinicalDoc";
import useCl from "../hooks/useClinicalDoc";

const ClinicalGrid = () => {
  //const { data, error } = useGames();

  const { details, error } = useClinicalDoc();

  const [isCaseNoSelected, setIsCaseNoSelected] = useState<boolean>(false);
  const [isPatientIdSelected, setIsPatientIdSelected] =
    useState<boolean>(false);
  const [isDocNameSelected, setIsDocNameSelected] = useState<boolean>(false);

  const [selectedPatient, setSelectedPatient] = useState("");
  const filteredPatient = selectedPatient
    ? details.filter((item) => item.Patient_ID === selectedPatient)
    : details;

  const [selectedCaseNo, setSelectedCaseNo] = useState<string>("");
  const filteredCaseNo = selectedCaseNo
    ? filteredPatient.filter((item) => item.Case_No === selectedCaseNo)
    : filteredPatient;

  const [selectedDocName, setSelectedDocName] = useState<string>("");
  const filteredDocName = selectedDocName
    ? filteredCaseNo.filter((item) => item.Document_Name === selectedDocName)
    : filteredCaseNo;

  const uniquePatientdID = Array.from(
    new Set(details.map((item) => item.Patient_ID))
  );
  const uniqueCaseNo = Array.from(
    new Set(filteredPatient.map((item) => item.Case_No))
  );
  const uniqueDocName = Array.from(
    new Set(filteredCaseNo.map((item) => item.Document_Name))
  );
  const uniqueDocDescription = Array.from(
    new Set(filteredDocName.map((item) => item.Document_Item_Description))
  );
  const [selectedPLaceHolder, setSelectedPlaceHolder] = useState<string>("");
  const handleCaseNoClick = (val: string) => {
    setSelectedCaseNo(val);
    setIsCaseNoSelected(true);
  };

  //hanndle change for select patient id where set the selected patient id and set the isPatientIdSelected to true. If selected patient id is empty then set the isPatientIdSelected to false
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatient(event.target.value);
    if (event.target.value === "") {
      setIsPatientIdSelected(false);
      setSelectedPlaceHolder("Select Patient");
    } else {
      setIsPatientIdSelected(true);
    }
  };

  //handle click to set all the selected values to empty and set all the isSelected to false

  const handleClearClick = () => {
    setIsPatientIdSelected(false);
    setIsCaseNoSelected(false);
    setIsDocNameSelected(false);
    setSelectedPatient("");
    setSelectedPlaceHolder("Select Patient");
  };

  const selectPlaceholder = selectedPLaceHolder
    ? selectedPLaceHolder
    : "Select Patient";

  return (
    <>
      <HStack spacing="25px" pb="25px" p="20px">
        <Select
          value={selectedPatient || ""}
          onChange={handleChange}
          placeholder={selectPlaceholder}
          width="500px"
        >
          {uniquePatientdID.map((value, index) => (
            <option key={index}>{value}</option>
          ))}
        </Select>
        <Button
          onClick={handleClearClick}
          colorScheme="teal"
          variant="solid"
          bg="#Ec8646"
        >
          Clear
        </Button>
      </HStack>
      {isPatientIdSelected && (
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            {uniqueCaseNo.map((value, index) => (
              <Tab
                key={index}
                onClick={() => handleCaseNoClick(value)}
                _selected={{ color: "white", bg: "#Ec8646" }}
              >
                {value}
              </Tab>
            ))}
          </TabList>
          {isCaseNoSelected && (
            <TabPanels>
              <Tabs colorScheme="orange" variant="enclosed">
                <TabList mb="1em">
                  {uniqueDocName.map((value, index) => (
                    <Tab key={index}>{value}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {uniqueDocName.map((value, index) => (
                    <TabPanel key={index}>
                      <Box p="6" width="100%" height="500px" overflow="auto">
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th width="5%">CaseNo</Th>
                              <Th width="10%">Date</Th>
                              <Th width="25%">Item</Th>
                              <Th width="60%">Value</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredCaseNo
                              .filter((item) => item.Document_Name === value)
                              .map((item, index) => (
                                <Tr key={index}>
                                  <Td>{item.Case_No}</Td>
                                  <Td>
                                    {formatDate(item.Authored_Date.toString())}
                                  </Td>
                                  <Td>{item.Document_Item_Description}</Td>
                                  <Td>{item.Value_Text}</Td>
                                </Tr>
                              ))}
                          </Tbody>
                        </Table>
                      </Box>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </TabPanels>
          )}
        </Tabs>
      )}
    </>
  );
};

function formatDate(dateString: string) {
  return `${dateString.substring(0, 4)}-${dateString.substring(
    4,
    6
  )}-${dateString.substring(6, 8)}`;
}

export default ClinicalGrid;
