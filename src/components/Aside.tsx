import { Link } from "react-router-dom";
import { Box, Heading, VStack, Button } from "@chakra-ui/react";
import "./Aside.css";
import { useState } from "react";

const Aside = () => {
  const [isHomeClicked, setIsHomeClicked] = useState(false);
  const [isDrugClicked, setIsDrugClicked] = useState(false);
  const [isLabClicked, setIsLabClicked] = useState(false);
  const [isRadioClicked, setIsRadioClicked] = useState(false);
  const [isReportClicked, setIsReportClicked] = useState(false);
  const bgColor = "#FDEADA";
  const hoverColor = "#EEECE1";
  const clickedColor = "#E54809";
  const clickedTextColor = "white";

  const handleHomeClick = () => {
    setIsHomeClicked(true);
    setIsDrugClicked(false);
    setIsLabClicked(false);
    setIsRadioClicked(false);
    setIsReportClicked(false);
  };

  const handleDrugClick = () => {
    setIsHomeClicked(false);
    setIsDrugClicked(true);
    setIsLabClicked(false);
    setIsRadioClicked(false);
    setIsReportClicked(false);
  };

  const handleLabClick = () => {
    setIsHomeClicked(false);
    setIsDrugClicked(false);
    setIsLabClicked(true);
    setIsRadioClicked(false);
    setIsReportClicked(false);
  };

  const handleRadioClick = () => {
    setIsHomeClicked(false);
    setIsDrugClicked(false);
    setIsLabClicked(false);
    setIsRadioClicked(true);
    setIsReportClicked(false);
  };

  const handleReportClick = () => {
    setIsHomeClicked(false);
    setIsDrugClicked(false);
    setIsLabClicked(false);
    setIsRadioClicked(false);
    setIsReportClicked(true);
  };

  return (
    <VStack spacing={0} align="start">
      <Link to="/">
        <Button
          bg={isHomeClicked ? clickedColor : bgColor}
          color={isHomeClicked ? clickedTextColor : "black"}
          _hover={{ bg: hoverColor }}
          onClick={handleHomeClick}
          width="200px"
        >
          {" "}
          Home
        </Button>
      </Link>
      <Link to="/drugs">
        <Button
          bg={isDrugClicked ? clickedColor : bgColor}
          color={isDrugClicked ? clickedTextColor : "black"}
          _hover={{ bg: hoverColor }}
          onClick={handleDrugClick}
          width="200px"
        >
          {" "}
          Drugs
        </Button>
      </Link>
      <Link to="/lab">
        <Button
          bg={isLabClicked ? clickedColor : bgColor}
          color={isLabClicked ? clickedTextColor : "black"}
          _hover={{ bg: hoverColor }}
          onClick={handleLabClick}
          width="200px"
        >
          {" "}
          Lab
        </Button>
      </Link>
      <Link to="/radiology">
        <Button
          bg={isRadioClicked ? clickedColor : bgColor}
          color={isRadioClicked ? clickedTextColor : "black"}
          _hover={{ bg: hoverColor }}
          onClick={handleRadioClick}
          width="200px"
        >
          {" "}
          Radiology
        </Button>
      </Link>
      <Link to="/report">
        <Button
          bg={isReportClicked ? clickedColor : bgColor}
          color={isReportClicked ? clickedTextColor : "black"}
          _hover={{ bg: hoverColor }}
          onClick={handleReportClick}
          width="200px"
        >
          {" "}
          Report
        </Button>
      </Link>
    </VStack>
  );
};

export default Aside;
