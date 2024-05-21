import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { SettingsArrow } from "./SettingsArrow";
import { SettingsIcon } from "./SettingsIcon";

export type Theme = "Light" | "Dark";

export const OptionsMenu = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const themeDetails = {
    Dark: { icon: faSun, className: "sun-icon", oppositeTheme: "Light" },
    Light: { icon: faMoon, className: "moon-icon", oppositeTheme: "Dark" },
  };

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "Light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    console.log(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "Light" ? "Dark" : "Light"));
  };

  return (
    <div className="options">
      <div>
        <Button
          className="settings-button"
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <SettingsIcon settingsOpen={settingsOpen} />
        </Button>
      </div>
      <div className="settings-wrapper">
        <div className={`settings-container ${!settingsOpen ? "closed" : ""}`}>
          <Button
            className={`${themeDetails[theme].oppositeTheme}-theme`}
            onClick={toggleTheme}
          >
            <FontAwesomeIcon
              icon={themeDetails[theme].icon}
              className={themeDetails[theme].className}
            />
          </Button>
          <div className={`Theme-text`} onClick={toggleTheme}>
            <p>{themeDetails[theme].oppositeTheme} Mode</p>
          </div>
        </div>
        <Button
          className={`settings-arrow ${!settingsOpen ? "closed" : ""}`}
          onClick={() => {
            setSettingsOpen(!settingsOpen);
          }}
        >
          <SettingsArrow settingsOpen={settingsOpen} />
        </Button>
      </div>
    </div>
  );
};
