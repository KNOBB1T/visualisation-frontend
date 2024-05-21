import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "../Styling/OptionsMenu.css";

export const SettingsIcon = ({ settingsOpen }: { settingsOpen: boolean }) => {
  return (
    //Allow arrow to rotate 90 degree to emphasise filter bar opening and closing
    // <div className="filter-arrow-container">
    <div
      data-testid="rotating-div"
      style={{
        cursor: "pointer",
        transition: "transform 0.3s ease-in",
        transform: `rotate(${settingsOpen ? "90deg" : "0deg"})`,
      }}
    >
      <FontAwesomeIcon icon={faGear} className="settings-icon" />
    </div>
    // </div>
  );
};
