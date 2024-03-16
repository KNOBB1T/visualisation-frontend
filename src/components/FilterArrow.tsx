import { FaAngleRight } from "react-icons/fa";
import "../Styling/SearchBar.css";
import React from "react";

export const FilterArrow = ({ filter }: { filter: boolean }) => {
  return (
    <div className="filter-arrow-container">
      <div
        data-testid="rotating-div"
        style={{
          cursor: "pointer",
          transition: "transform 0.2s ease-in",
          transform: `rotate(${filter ? "90deg" : "0deg"})`,
        }}
      >
        <FaAngleRight data-testid="angle-right" />
      </div>
    </div>
  );
};
