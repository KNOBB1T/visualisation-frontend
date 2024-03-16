import "../App.css";
import { SearchBar } from "../Components/SearchBar";
// import { useEffect, useRef, useState } from "react";
import visionet from "../visionet.png";
import { ChartSearch } from "../Components/ChartSearch";
import { ComparisonWidget } from "../Components/ComparisonWidget";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const Home = ({ speciesData }: { speciesData: Species[] }) => {
  console.log("HOME RENDERING---------------------");
  return (
    <div className="App">
      <div className="home">
        <div className="visionet-container">
          <div className="main-title">
            <img className="visionet" src={visionet} alt="visionet" />
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
