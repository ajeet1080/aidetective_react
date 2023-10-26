import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  Text,
  IconButton,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import useClinicalDoc from "../hooks/useClinicalDoc";
import useDrug from "../hooks/useDrug";
import usePrompt from "../hooks/usePrompt";
import useLab from "../hooks/useLab";
import useRadiology from "../hooks/useRadiology";
import {
  ClimbingBoxLoader,
  PacmanLoader,
  PropagateLoader,
} from "react-spinners";
import { domMax } from "framer-motion";

const Prompt: React.FC<{ selectedCaseNumber: string }> = ({
  selectedCaseNumber,
}) => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const { details, error } = useClinicalDoc();
  const drugdata = useDrug();
  const raddata = useRadiology();
  const labdata = useLab();

  const filteredCaseNo = selectedCaseNumber
    ? details.filter((item) => item.Case_No === selectedCaseNumber)
    : details;

  const filteredDrug = selectedCaseNumber
    ? drugdata.data.filter(
        (item: { Case_No: string }) => item.Case_No === selectedCaseNumber
      )
    : drugdata.data;

  const filteredLab = selectedCaseNumber
    ? labdata.data.filter(
        (item: { Case_No: string }) => item.Case_No === selectedCaseNumber
      )
    : labdata.data;

  const filteredRadiology = selectedCaseNumber
    ? raddata.data.filter(
        (item: { Case_No: string }) => item.Case_No === selectedCaseNumber
      )
    : raddata.data;

  const uniqueDrug = Array.from(
    new Set(filteredDrug.map((item) => `   ${item.Drug_Name}    `))
  );

  const uniqueLab = Array.from(
    new Set(filteredLab.map((item) => `   ${item.Lab_Test_Description}      `))
  );

  const uniqueRadiology = Array.from(
    new Set(filteredRadiology.map((item) => ` ${item.Report_cleaned}     `))
  );

  const uniqueUROClinicalNotes = Array.from(
    new Set(
      filteredCaseNo
        .filter((item) => item.Document_Item_Description === "Clinical Note")
        .map((item) => item.Value_Text)
    )
  );

  const uniqueDepartment = Array.from(
    new Set(
      filteredCaseNo
        .filter((item) => item.Right_Label === "Main Location")
        .map((item) => item.Value_Text)
    )
  );

  const uniqueDiagnosis = Array.from(
    new Set(
      filteredCaseNo
        .filter((item) => item.Left_Label.includes("Diagnosis"))
        .map((item) => item.Value_Text)
    )
  );

  const uniqueInstitution = Array.from(
    new Set(filteredCaseNo.map((item) => item.Institution_Code))
  );

  const filteredItems = filteredCaseNo.filter((item) =>
    item.Document_Item_Name_Long.includes("NUR_VitalSigns")
  );

  const uniqueVitals = Array.from(
    new Set(
      filteredItems.map((item) => `   ${item.Left_Label}: ${item.Value_Text}  `)
    )
  );

  const uniqueConsultDate = Array.from(
    new Set(
      filteredCaseNo
        .filter((item) => item.Document_Name.includes("Provider Note"))
        .map((item) => Number(item.Authored_Date))
    )
  ).sort((a, b) => a - b)[0];
  //const uniqueConsultDate2 = uniqueConsultDate.toString().slice(0, 8);

  const uniqueRegistrationDate = Array.from(
    new Set(
      filteredCaseNo.map((item) => {
        // Extract parts of the date
        const year = item.Authored_Date.toString().slice(0, 4);
        const month = item.Authored_Date.toString().slice(4, 6);
        const day = item.Authored_Date.toString().slice(6, 8);
        const hour = item.Authored_Date.toString().slice(8, 10);
        const minute = item.Authored_Date.toString().slice(10, 12);
        const second = item.Authored_Date.toString().slice(12, 14);

        // Create a new Date object
        //const date = new Date(Number(year), Number(month) - 1, Number(day));
        const date = Number(year + month + day);

        // Format the date
        return date;
      })
    )
  ).sort((a, b) => a - b)[0];

  const handlePromptChange = (event: any) => {
    setPrompt(event.target.value);
  };

  const handleResponseChange = (event: any) => {
    setResponse(event.target.value);
  };

  const input_file = {
    "Upon admission patient chief complaint as ": { uniqueUROClinicalNotes },
    department: { uniqueDepartment },
    "\n Hospital to which patient as brought in": { uniqueInstitution },
    "\n Date on which patient was brought to hospital was": {
      uniqueRegistrationDate,
    },
    "\n Vital signs of patient when brought in was in format Vital 'Sign Name': 'Measured value'":
      { uniqueVitals },
    "\n Doctor consulation date for patient as": { uniqueConsultDate },
    "\n Referral record for the patient as": { uniqueDiagnosis },
    "\n Medical prescribed to patient as in format 'Drug Name': 'Instruction for durg intake'":
      { uniqueDrug },
  }.toString();

  const emd_prompt = `## Instruction:
Write a medical report for the patient based on the sample template format and Patient_data given below.
- Replace () with appropriate data from the variables below.
- Give only information about the patient and his condition, not about relatives, aspirations.
- Replace patient name with <Patient> and doctor name with <Doctor>
- Give full expansion of department name, Institution example: SGH is Singapore General Hospital
- Give only information available in the data.

Patient_data:
    "complaint: " 
    ${uniqueUROClinicalNotes} 
    "department : Department of Urology"     
    "Institution : " 
    ${uniqueInstitution} 
    "Admission_datetime : " 
    ${uniqueRegistrationDate} 
    "Consult_time : " 
    ${uniqueConsultDate} 
    "diagnosis: " 
    ${uniqueDiagnosis} 


##Sample template

Medical report on <Patient>
NRIC: <NRIC>

The patient was attended to the (department) of (Institution) on (Admission date). 

(describe patient complaint or medical condition and any other significant symptoms).(Physical examination results).(Any radiology or ultrasound reports
)

He was given advice of (any lifestyle change advice) for the treatment of (medical condition)). (results after follow up or next follow up plans)

"""`;
  const [isReportShown, setIsReportShown] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const apiResponse = await usePrompt(emd_prompt);
      // Check if there is a response and it has a content property
      if (apiResponse) {
        const response = apiResponse.content;
        setResponse(response);
        setLoading(false);
      } else {
        throw new Error(
          "No response from API or response does not contain content"
        );
      }
    } catch (error) {
      console.error(error);
      // Handle error appropriately in your application
    }
    setIsReportShown(true);
  };
  const [isComplaintExpanded, setIsComplaintExpanded] = useState(false);
  const [isVitalSignExpanded, setIsVitalSignExpanded] = useState(false);
  const [isMedicationExpanded, setIsMedicationExpanded] = useState(false);
  const [isRadiologyExpanded, setIsRadiologyExpanded] = useState(false);
  const [isReferralExpanded, setIsReferralExpanded] = useState(false);

  const [index, setIndex] = useState(0);
  const messages = ["Thank you!", "Please hold on....", "Generating Report"];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [loading]);

  return loading ? (
    <VStack
      spacing={4}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <PacmanLoader color="#Ec8646" />
      <Text color="#Ec8646" fontSize="24px">
        {messages[index]}
      </Text>
    </VStack>
  ) : (
    <VStack spacing={4}>
      {isReportShown && (
        <Box border="1px" borderColor="gray.200" p={2} width="100%">
          <Textarea
            height="400px"
            value={response}
            onChange={handleResponseChange}
          />
        </Box>
      )}
      {isReportShown && (
        <HStack spacing={4}>
          <IconButton
            icon={<AiFillLike />}
            colorScheme="green"
            onClick={() => console.log("Thumbs Up")}
            aria-label={""}
          />
          <IconButton
            icon={<AiFillDislike />}
            colorScheme="red"
            onClick={() => console.log("Thumbs Down")}
            aria-label={""}
          />
        </HStack>
      )}
      <Box border="1px" borderColor="gray.200" p={2} width="100%" height="100%">
        <Heading as="h3" size="md">
          Patient complaint
        </Heading>
        {isComplaintExpanded && (
          <ul>
            {uniqueUROClinicalNotes.map((notes, index) => (
              <li key={index}>{notes}</li>
            ))}
          </ul>
        )}
        <Button
          bg="#Ec8646"
          style={{ color: "white" }}
          onClick={() => setIsComplaintExpanded(!isComplaintExpanded)}
        >
          {isComplaintExpanded ? "Collapse" : "Expand"}
        </Button>
      </Box>
      <Box border="1px" borderColor="gray.200" p={2} width="100%" height="100%">
        <Heading as="h3" size="md">
          Vital Signs
        </Heading>
        {isVitalSignExpanded && <Text height="auto">{uniqueConsultDate} </Text>}
        <Button
          bg="#Ec8646"
          style={{ color: "white" }}
          onClick={() => setIsVitalSignExpanded(!isVitalSignExpanded)}
        >
          {isVitalSignExpanded ? "Collapse" : "Expand"}
        </Button>
      </Box>
      <Box border="1px" borderColor="gray.200" p={2} width="100%" height="100%">
        <Heading as="h3" size="md">
          Medication
        </Heading>
        {isMedicationExpanded && <Text height="auto">{uniqueDrug}</Text>}
        <Button
          bg="#Ec8646"
          style={{ color: "white" }}
          onClick={() => setIsMedicationExpanded(!isMedicationExpanded)}
        >
          {isMedicationExpanded ? "Collapse" : "Expand"}
        </Button>
      </Box>

      <Box border="1px" borderColor="gray.200" p={2} width="100%" height="100%">
        <Heading as="h3" size="md">
          Lab test
        </Heading>
        {isRadiologyExpanded && <Text height="auto">{uniqueLab} </Text>}
        <Button
          bg="#Ec8646"
          style={{ color: "white" }}
          onClick={() => setIsRadiologyExpanded(!isRadiologyExpanded)}
        >
          {isRadiologyExpanded ? "Collapse" : "Expand"}
        </Button>
      </Box>

      <Box border="1px" borderColor="gray.200" p={2} width="100%" height="100%">
        <Heading as="h3" size="md">
          Diagnosis
        </Heading>
        {isReferralExpanded && (
          <ul>
            {uniqueDiagnosis.map((diagnosis, index) => (
              <li key={index}>{diagnosis}</li>
            ))}
          </ul>
        )}
        <Button
          bg="#Ec8646"
          style={{ color: "white" }}
          onClick={() => setIsReferralExpanded(!isReferralExpanded)}
        >
          {isReferralExpanded ? "Collapse" : "Expand"}
        </Button>
      </Box>

      <Button bg="#Ec8646" style={{ color: "white" }} onClick={handleSubmit}>
        Generate
      </Button>
    </VStack>
  );
};

export default Prompt;
