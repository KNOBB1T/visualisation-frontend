import "../App.css";
import { SearchBar } from "../components/SearchBar";
// import { useEffect, useRef, useState } from "react";
import visionet from "../visionet.png";
import { ChartSearch } from "../components/ChartSearch";

export const Home = ({ speciesData }: { speciesData: Species[] }) => {
  console.log("HOME RENDERING---------------------");
  return (
    <div className="App">
      <div className="visionet-container">
        <div className="main-title">
          <img className="visionet" src={visionet} alt="visionet" />
        </div>
        <div className="species-pie-chart">
          <ChartSearch speciesData={speciesData} />
        </div>
        <div className="search-bar-container">
          <SearchBar speciesData={speciesData} />
          {/* <div>SearchResults</div> */}
        </div>
      </div>
    </div>
  );
};
