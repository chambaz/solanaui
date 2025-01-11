"use client";

import React from "react";

import { IconCheck, IconPalette, IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme as useNextTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "../ui/skeleton";

type Theme = (typeof themes)[number]["name"];

type ThemeContextType = {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
};

type ModeToggleProps = {
  type?: "toggle" | "toggle-group";
};

export const themes = [
  {
    name: "zinc",
    color: "#52525A",
  },
  {
    name: "red",
    color: "#CA3A32",
  },
  {
    name: "rose",
    color: "#CF364C",
  },
  {
    name: "orange",
    color: "#D9622B",
  },
  {
    name: "green",
    color: "#5EC26A",
  },
  {
    name: "blue",
    color: "#4E80EE",
  },
  {
    name: "yellow",
    color: "#F3CE49",
  },
  {
    name: "violet",
    color: "#652CD1",
  },
] as const;

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

const ThemeProvider = ({
  children,
  defaultColorTheme = "zinc",
}: {
  children: React.ReactNode;
  defaultColorTheme?: Theme;
}) => {
  const [theme, setTheme] = React.useState<Theme>(defaultColorTheme);

  const updateTheme = React.useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    document.cookie = `sol-theme=${newTheme};path=/;max-age=31536000`;

    document.documentElement.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        document.documentElement.classList.remove(className);
      }
    });
    document.documentElement.classList.add(`theme-${newTheme}`);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex translate-y-[1px] items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary data-[state=open]:text-primary">
          <IconPalette size={16} />
          Themes
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="center"
        sideOffset={12}
        className="w-80 space-y-6"
      >
        <p className="text-sm text-muted-foreground">
          SolanaUI components will work with any shadcn theme, just import into
          your codebase. Try the examples below.
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Color</h4>
          <ul className="grid grid-cols-3 gap-2">
            {themes.map((themeOption) => (
              <li key={themeOption.name}>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2 px-2 capitalize",
                    themeOption.name === theme &&
                      "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setTheme(themeOption.name)}
                >
                  <div
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: themeOption.color }}
                  >
                    {themeOption.name === theme && <IconCheck size={12} />}
                  </div>
                  {themeOption.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Mode</h4>
          <ModeToggle type="toggle-group" />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ModeToggle = ({ type = "toggle" }: ModeToggleProps) => {
  const { theme, setTheme } = useNextTheme();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="h-[36px] w-[42px] rounded-lg" />;
  }

  if (type === "toggle") {
    return (
      <Toggle
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="bg-transparent hover:text-primary data-[state=on]:bg-transparent data-[state=on]:hover:bg-accent"
      >
        {theme === "light" ? <IconSun size={18} /> : <IconMoon size={18} />}
      </Toggle>
    );
  } else if (type === "toggle-group") {
    return (
      <ToggleGroup
        type="single"
        className="justify-start gap-2"
        value={theme}
        onValueChange={(value) => {
          console.log("value", value);
          setTheme(value);
        }}
      >
        <ToggleGroupItem value="light" className="p-0">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full",
              theme === "light" && "bg-accent text-accent-foreground",
            )}
          >
            <IconSun size={16} /> Light
          </Button>
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" className="p-0">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full",
              theme === "dark" && "bg-accent text-accent-foreground",
            )}
          >
            <IconMoon size={16} /> Dark
          </Button>
        </ToggleGroupItem>
      </ToggleGroup>
    );
  }

  return null;
};

export { ThemeProvider, ThemeSelector, useTheme, ModeToggle };
