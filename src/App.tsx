import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./Pages/Home";
import { NetworkView } from "./Pages/NetworkView";
import { ComparisonView } from "./Pages/ComparisonView";
import React from "react";
import { ThemeContext } from "./theme-context";

function App() {
  const [speciesData, setSpeciesData] = useState<Species[]>([]);

  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme;

  console.log("APP RENDERING---------------------");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/retrieveDataframe"
        );
        setSpeciesData(response.data);
        console.log("successful render!");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme ?? "Light");
  }, [theme]);

  return (
    <BrowserRouter>
      <main className={theme === "Light" ? "light-theme" : "dark-theme"}>
        <Routes>
          <Route path="/" element={<Home speciesData={speciesData} />} />
          <Route
            path="/generateNetwork/:queriedSpeciesId"
            element={<NetworkView speciesData={speciesData} />}
          />
          <Route
            path="/networkComparison"
            element={<ComparisonView speciesData={speciesData} />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
