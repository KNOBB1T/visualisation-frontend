import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "../Styling/OptionsMenu.css";

export const SettingsArrow = ({ settingsOpen }: { settingsOpen: boolean }) => {
  return (
    <div
      data-testid="rotating-div"
      style={{
        cursor: "pointer",
        transition: "transform 0.25s ease-in",
        transform: `rotate(${settingsOpen ? "180deg" : "0deg"})`,
      }}
    >
      <FontAwesomeIcon icon={faAnglesRight} className="arrow-icon" />
    </div>
  );
};
