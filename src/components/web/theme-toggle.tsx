"use client";

import React from "react";

import { useTheme } from "next-themes";
import { IconSun, IconMoon } from "@tabler/icons-react";

import { Toggle } from "@/components/ui/toggle";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Toggle onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? <IconSun size={18} /> : <IconMoon size={18} />}
    </Toggle>
  );
};

export { ThemeToggle };
