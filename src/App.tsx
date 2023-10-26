import {
  Grid,
  GridItem,
  HStack,
  Show,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import NavBar from "./components/NavBar";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ClinicalGrid from "./components/ClinicalGrid";
import Aside from "./components/Aside";

import { ClinicalDoc } from "./hooks/useClinicalDoc";
import Drug from "./components/Drug";
import Lab from "./components/Lab";
import Radiology from "./components/Radiology";
import Prompt from "./components/Prompt";

function App() {
  //Lift state up from ClinicalGrid to App for selectedCaseNumber
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string>("");

  const bg = useColorModeValue("gray.100", "gray.900");
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
    >
      <GridItem area="nav" height="100px">
        <NavBar />
      </GridItem>

      <GridItem area="aside" bg="#FDEADA" width="200px" height="1000">
        <Aside />
      </GridItem>
      <GridItem area="main" width="1500px" height="500px">
        <Routes>
          <Route
            path="/"
            element={
              <ClinicalGrid setSelectedCaseNumber={setSelectedCaseNumber} />
            }
          />
          <Route
            path="/drugs"
            element={<Drug selectedCaseNumber={selectedCaseNumber} />}
          />
          <Route
            path="/lab"
            element={<Lab selectedCaseNumber={selectedCaseNumber} />}
          />
          <Route
            path="/radiology"
            element={<Radiology selectedCaseNumber={selectedCaseNumber} />}
          />
          <Route
            path="/report"
            element={<Prompt selectedCaseNumber={selectedCaseNumber} />}
          />
        </Routes>
      </GridItem>
    </Grid>
  );
}

export default App;
