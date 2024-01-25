import { FaAngleRight } from "react-icons/fa";
import "./SearchBar.css";

export const FilterArrow = ({ filter }: { filter: boolean }) => {
  return (
    <div className="filter-arrow-container">
      <div
        style={{
          cursor: "pointer",
          transition: "transform 0.2s ease-in",
          transform: `rotate(${filter ? "90deg" : "0deg"})`,
        }}
      >
        <FaAngleRight />
      </div>
    </div>
  );
};
