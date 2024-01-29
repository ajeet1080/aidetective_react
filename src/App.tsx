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
        "https://transcribe003.azurewebsites.net/solve-mystery",
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
        "https://transcribe003.azurewebsites.net/similarity_score",
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
        "https://transcribe003.azurewebsites.net/capture-result",
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
                fontSize="3xl"
                fontWeight="bold"
                color="white"
              >
                <Text>
                  Your score is{" "}
                  <Text as="span" color="pink" fontSize="6xl">
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
                  fontFamily="cursive"
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
            <ModalHeader>How to Play</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize="lg" color="white.400">
                Greetings, Detectives! your mission is to assist the
                investigative team in unraveling the mystery of the vanished
                Merlion Statue from Marina Bay, Singapore. Please read the Case
                Summary for more details about the incident.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                Chatbot Interaction:
              </Heading>
              <Text fontSize="lg" color="white.400">
                Engage with the chatbot, by responding to prompts and questions.
                Use your detective skills to analyze the provided clues and
                uncover the truth behind the disappearance.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                Clue Analysis::
              </Heading>
              <Text fontSize="lg" color="white.400">
                Thoroughly examine each of the clues provided, ranging from
                surveillance footage to social media posts. Collaborate with
                your team to connect the dots and construct a plausible theory
                about the incident.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                Team Collaboration::
              </Heading>
              <Text fontSize="lg" color="white.400">
                Communicate effectively with your team members. Share insights,
                discuss theories, and build upon each other's observations. Your
                collective effort is crucial to cracking this case.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                Theory Formulation::
              </Heading>
              <Text fontSize="lg" color="white.400">
                Based on your analysis, formulate a theory regarding how and why
                the Merlion Statue vanished. Be ready to present your team's
                theory at the end of the game.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                AI Detective Clues:
              </Heading>
              <Text fontSize="lg" color="white.400">
                I will provide clues that indirectly lead to the solution. These
                clues are meant to guide your thinking without providing direct
                answers. Utilize the information wisely and consider all aspects
                of the case.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                Tips for Success::
              </Heading>
              <Text fontSize="lg" color="white.400">
                Pay attention to the cultural context and recent events in
                Singapore. Collaborate and discuss with your team to gather
                diverse perspectives. Think critically and connect the dots
                between different clues. Enjoy the challenge and immerse
                yourself in the investigation process.
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
            <ModalHeader>Case Summary</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize="lg" color="white.400">
                In the heart of Singapore, overlooking the stunning Marina Bay,
                stood the iconic Merlion Statue—a symbol of the nation's rich
                heritage and a beloved landmark that had become a source of
                pride for the city. However, the tranquility of this picturesque
                scene was shattered when, under the cloak of night, the Merlion
                mysteriously disappeared, leaving the city in a state of
                disbelief and confusion. As the news of the statue's
                disappearance spread like wildfire, a special investigative team
                was assembled to unravel this peculiar case. The team, comprised
                of top-notch detectives, was determined to restore the symbol of
                Singapore to its rightful place and bring the culprit to
                justice.
              </Text>

              <Heading as="h4" size="md" color="pink" mt={4}>
                Clues:
              </Heading>
              <Text fontSize="lg" color="white.400">
                The investigative team has gathered a series of clues, including
                surveillance footage, interview transcripts, GPS tracking data,
                social media posts, construction records, maritime activity
                logs, an anonymous email tip, and local art scene rumors. Each
                clue plays a crucial role in piecing together the puzzle and
                revealing the truth.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                Your Mission:
              </Heading>
              <Text fontSize="lg" color="white.400">
                Your mission is to uncover the truth behind the disappearance
                and solve the mystery that has captured the attention of the
                entire nation.
              </Text>
              <Heading as="h4" size="md" color="pink" mt={4}>
                Your Role:
              </Heading>
              <Text fontSize="lg" color="white.400">
                As participants in this AI Detective Game, you are key members
                of the investigative team. With the help of this chatbot, ask
                right questions and you will analyze these clues, make decisions
                at critical junctures, and formulate a theory that uncovers the
                motives and methods behind the disappearance of the Merlion.
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
              <Button colorScheme="blue" mr={3} onClick={onSummaryClose}>
                Close
              </Button>
              <Button colorScheme="telegram" onClick={handleResponseSubmit}>
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
