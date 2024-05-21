import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Theme } from "./Components/OptionsMenu";

export interface ThemeContextInterface {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

export const ThemeContext = createContext<ThemeContextInterface | null>(null);

export interface ThemeProviderInterface {
  children: ReactNode[] | ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderInterface) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "Light"
  ); // directly initialising with local storage or default value

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]); // every time the theme state updates we also update in local storage

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
