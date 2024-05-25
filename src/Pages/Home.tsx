import "../App.css";
import { SearchBar } from "../Components/SearchBar";
import visionet from "../assets/visionet.png";
import darkVisionet from "../assets/dark-visionet.png";
import { ChartSearch } from "../Components/ChartSearch";
import { ComparisonWidget } from "../Components/ComparisonWidget";
import React, { useContext } from "react";
import { OptionsMenu } from "../Components/OptionsMenu";
import "../Styling/OptionsMenu.css";
import { ThemeContext } from "../Contexts/ThemeContext";

export const Home = ({ speciesData }: { speciesData: Species[] }) => {
  console.log("HOME RENDERING---------------------");
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`App ${theme === "Light" ? "light-theme" : "dark-theme"}`}>
      <div className="home">
        <div className="visionet-container">
          <div className="main-title">
            <OptionsMenu />
            <img
              className={`home-visionet ${
                theme === "Light" ? "light-visionet" : "dark-visionet"
              }`}
              src={theme === "Light" ? visionet : darkVisionet}
              alt="visionet"
            />
          </div>
        </div>
        <div className="home-content">
          <div>
            <div className="species-pie-chart">
              <ChartSearch speciesData={speciesData} />
            </div>
            <div className="search-bar-container">
              <SearchBar speciesData={speciesData} />
            </div>
          </div>
          <div>
            <ComparisonWidget />
          </div>
        </div>
      </div>
    </div>
  );
};
