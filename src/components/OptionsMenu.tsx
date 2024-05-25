import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { SettingsArrow } from "./SettingsArrow";
import { SettingsIcon } from "./SettingsIcon";
import { ThemeContext } from "../Contexts/ThemeContext";

// export type Theme = "Light" | "Dark";

export const OptionsMenu = () => {
  const [settingsOpen, setSettingsOpen] = useState(() => {
    return sessionStorage.getItem("settingsOpen") === "true";
  });

  const themeDetails = {
    Dark: { icon: faSun, className: "sun-icon", oppositeTheme: "Light" },
    Light: { icon: faMoon, className: "moon-icon", oppositeTheme: "Dark" },
  };

  // const [theme, setTheme] = useState<Theme>(() => {
  //   return (localStorage.getItem("theme") as Theme) || "Light";
  // });

  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    sessionStorage.setItem("settingsOpen", settingsOpen.toString());
  }, [settingsOpen]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    console.log(theme);
  }, [theme]);

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
            onClick={() =>
              setTheme((prev) => (prev === "Light" ? "Dark" : "Light"))
            }
          >
            <FontAwesomeIcon
              icon={themeDetails[theme].icon}
              className={themeDetails[theme].className}
            />
          </Button>
          <div
            className={`Theme-text`}
            onClick={() =>
              setTheme((prev) => (prev === "Light" ? "Dark" : "Light"))
            }
          >
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
