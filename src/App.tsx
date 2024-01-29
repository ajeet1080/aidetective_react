import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Heading,
  Flex,
  Image,
  HStack,
  Spinner,
  FormControl,
  FormLabel,
  ModalFooter,
  Textarea,
} from "@chakra-ui/react";
import Merlion from "./assets/Merlion.png";
import shslogo from "./assets/singhealth-logo.png";

export const App = () => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ query: string; result: string }[]>(
    []
  );
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isScoreLoading, setIsScoreLoading] = useState(false);
  const [isScoreRecieved, setIsScoreRecieved] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSummaryOpen,
    onOpen: onSummaryOpen,
    onClose: onSummaryClose,
  } = useDisclosure();

  const {
    isOpen: isSubmitOpen,
    onOpen: onSubmitOpen,
    onClose: onSubmitClose,
  } = useDisclosure();
  const [teamName, setTeamName] = useState("");
  const [apiReasonResponse, setApiReasonResponse] = useState("");
  const [apiScoreResponse, setApiScoreResponse] = useState("");
  const [submittedvalue, setSubmittedValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const solveMystery = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a query.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    setIsScoreRecieved(false);

    try {
      const response = await fetch(
        "https://gameapi01.azurewebsites.net/solve-mystery",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: query }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setHistory((prevHistory) =>
        [
          ...prevHistory,
          { query: query, result: data.response || data.error },
        ].slice(-5)
      ); // Keep only the last 5 items
      setQuery(""); // Clear the query
      setIsLoading(false); // Stop loading
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch response from the server.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const [colorIndex, setColorIndex] = useState(0);
  const colors = [
    "red.500",
    "orange.500",
    "white",
    "pink.500",
    "blue.500",
    "white",
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setColorIndex((colorIndex + 1) % colors.length);
    }, 1000); // changes color every second

    return () => clearInterval(intervalId); // cleanup on unmount
  }, [colorIndex, colors.length]);

  const handleResponseSubmit = async () => {
    setIsScoreLoading(true);
    onSubmitClose();

    try {
      const similarityScoreResponse = await fetch(
        "https://gameapi01.azurewebsites.net/similarity_score",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: submittedvalue }),
        }
      );

      const data = await similarityScoreResponse.json();

      setApiReasonResponse(data.reason);
      setApiScoreResponse(data.score);
      setIsScoreRecieved(true);

      const captureResultResponse = await fetch(
        "https://gameapi01.azurewebsites.net/capture-result",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamname: teamName,
            score: data.score,
            submitted_text: submittedvalue,
          }),
        }
      );

      const capturedata = await captureResultResponse.json();

      // handle captureResultResponse as needed
    } catch (error) {
      console.error(error);
    } finally {
      setIsScoreLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    onSubmitOpen();
    setIsScoreRecieved(false);
  };

  return (
    <>
      <Image src={shslogo} alt="SingHealth Logo" width={180} height={100} />

      <HStack spacing={4}>
        <Button ml={6} colorScheme="orange" onClick={onOpen}>
          How to Play
        </Button>
        <Button colorScheme="orange" onClick={onSummaryOpen}>
          Case Summary
        </Button>
        <Button colorScheme="orange" onClick={handleSubmitAnswer}>
          Submit Answer
        </Button>
      </HStack>

      <Box
        backgroundImage={`url(${Merlion})`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        minHeight="100vh"
        width="100vw"
        padding={4}
      >
        <VStack spacing={4}>
          <Text
            ml={1}
            fontSize="4xl"
            fontWeight="bold"
            color={colors[colorIndex]}
          >
            AI Detective Game
          </Text>
          {isScoreLoading ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="orange.500"
              size="xl"
            />
          ) : (
            isScoreRecieved && (
              <Box
                bg="blackAlpha.700"
                w="100%"
                p={4}
                fontSize="xl"
                color="white"
              >
                <Text>
                  Your score is{" "}
                  <Text as="span" color="pink" fontSize="4xl" fontWeight="bold">
                    {apiScoreResponse}
                  </Text>
                  {", "}
                  {apiReasonResponse.toLowerCase()}
                </Text>
              </Box>
            )
          )}
          <Box
            w="100%"
            bg="blackAlpha.700"
            borderRadius="md"
            overflowY="auto"
            maxH="800px"
          >
            {history.map((item, index) => (
              <VStack key={index} align="start" spacing={2}>
                <Text
                  fontWeight="bold"
                  color="orange.400"
                >{`You: ${item.query}`}</Text>
                <Text
                  color="whiteAlpha.800"
                  fontFamily="calibri"
                >{`AI: ${item.result}`}</Text>
              </VStack>
            ))}
          </Box>
          <Input
            placeholder="Enter your query about the mystery..."
            sx={{
              "::placeholder": {
                color: "#fca503", // Change this to your desired color
              },
            }}
            value={query}
            onChange={handleInputChange}
            color="whiteAlpha.800"
            fontSize="3xl"
            fontWeight="bold"
          />
          <Button
            colorScheme="pink"
            onClick={solveMystery}
            isLoading={isLoading}
          >
            {isLoading ? <Spinner /> : "Enter"}
          </Button>
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            backgroundColor="rgba(0, 0, 0, 0.5)"
            color="white"
            width="500px"
          >
            <ModalHeader color="pink" fontSize="2xl">
              How to Play
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize="lg" color="white.400">
                Greetings, Detectives! You have been activated to assist the
                police to solve the mystery of the missing Merlion. Please read
                the Case Summary for more information about the incident.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                Introduction:
              </Heading>
              <Text fontSize="lg" color="white.400">
                The evidence collected by the police have been stored in an
                encrypted database that can only be extracted by chatting with
                it. Use your investigative skills to expose the evidence
                collected and piece together the puzzle and uncover the truth.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                Game play:
              </Heading>
              <Text fontSize="lg" color="white.400">
                Interact with the database using the chatbot, navigating through
                various stages of the investigation, examining clues,
                interviewing witnesses, and piecing together the timeline of
                events leading up to the merlion's disappearance. Replies
                generated will be based on what the chatbot knows. Although the
                answers you receive may lead you down unexpected paths, stay
                sharp and question everything. What appears to be the truth may
                turn out to be nothing more than a hallucination.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                Submitting your Answer:
              </Heading>
              <Text fontSize="lg" color="white.400">
                When you have arrived at your hypothesis of the events, submit
                your answer. Don’t forget to include: - Who abducted the
                Merlion? - How did the Merlion disappear? - The motivation
                behind the heist
              </Text>
              <Text fontSize="lg" color="white.400">
                -----------------------------------------------------
              </Text>

              <Text fontSize="lg" color="white.400">
                Get ready to embark on the ultimate detective adventure and
                solve the mystery of the missing Merlion!
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal isOpen={isSummaryOpen} onClose={onSummaryClose}>
          <ModalOverlay />
          <ModalContent
            backgroundColor="rgba(0, 0, 0, 0.5)"
            color="white"
            width="500px"
          >
            <ModalHeader color="pink" fontSize="2xl">
              Case Summary
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize="lg" color="white.400">
                On 2 January 2024 6:23am, the police received a call alerting
                them to the disappearance of the Merlion Statue along the
                Singapore River. The police assigned to the case have been
                unable to solve it and have called you to help them. All the
                findings from the case have been stored in an encrypted
                database. The only way to retrieve the clues is to leverage on
                generative AI to extract out the information.
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal isOpen={isSubmitOpen} onClose={onSubmitClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enter your final answer</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Team Name</FormLabel>
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Response</FormLabel>
                <Textarea
                  value={submittedvalue}
                  size="lg"
                  minHeight="400px"
                  onChange={(e) => setSubmittedValue(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="orange" mr={3} onClick={onSummaryClose}>
                Close
              </Button>
              <Button colorScheme="orange" onClick={handleResponseSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default App;
