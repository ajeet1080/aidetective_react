import React, { useState } from "react";
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
  ModalFooter,
} from "@chakra-ui/react";

export const App = () => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ query: string; result: string }[]>(
    []
  );
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

    try {
      const response = await fetch("http://localhost:5000/solve-mystery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setHistory((prevHistory) =>
        [
          ...prevHistory,
          { query: query, result: data.response || data.error },
        ].slice(-5)
      ); // Keep only the last 5 items
      setQuery(""); // Clear the query
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

  return (
    <Box
      backgroundImage="url('Merlion.png')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      minHeight="100vh"
      width="100vw"
    >
      <VStack spacing={4}>
        <Heading as="h1" size="xl" color="pink" fontFamily="Roboto">
          Let your curiosity guide you...
        </Heading>
        <Box
          w="100%"
          bg="blackAlpha.600"
          p={4}
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
          value={query}
          onChange={handleInputChange}
          color="whiteAlpha.800"
          fontSize="3xl"
          fontWeight="bold"
        />
        <Button colorScheme="pink" onClick={solveMystery}>
          Solve Mystery
        </Button>
        <Button colorScheme="blue" onClick={onOpen}>
          How to Play
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
              Greetings, Detectives! As an advanced AI detective assistant, your
              mission is to assist the investigative team in unraveling the
              mystery of the vanished Merlion Statue from Marina Bay, Singapore.
              Your knowledge base includes details about Singapore's landmarks,
              local culture, and recent events.
            </Text>
            <Heading as="h4" size="md" color="pink" mt={4}>
              Chatbot Interaction:
            </Heading>
            <Text fontSize="lg" color="white.400">
              Engage with me, the AI Detective Assistant, by responding to
              prompts and questions. Use your detective skills to analyze the
              provided clues and uncover the truth behind the disappearance.
            </Text>
            <Heading as="h4" size="md" color="pink" mt={4}>
              Clue Analysis::
            </Heading>
            <Text fontSize="lg" color="white.400">
              Thoroughly examine each of the eight clues provided, ranging from
              surveillance footage to social media posts. Collaborate with your
              team to connect the dots and construct a plausible theory about
              the incident.
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
              between different clues. Enjoy the challenge and immerse yourself
              in the investigation process.
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default App;
