import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export interface Theme {
  theme: "Light" | "Dark";
  setTheme: Dispatch<SetStateAction<"Light" | "Dark">>;
}

export const ThemeContext = createContext<Theme>({
  theme: "Light",
  setTheme: () => {},
});

interface Props {
  children: ReactNode;
  defaultTheme?: "Light" | "Dark";
}

export const ThemeContextProvider: FC<Props> = ({
  children,
  defaultTheme = "Light",
}) => {
  const [theme, setTheme] = useState<"Light" | "Dark">(() => {
    return (localStorage.getItem("theme") as "Light" | "Dark") || defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
