
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Particles } from "./particles/index";

export interface ParticlesBackgroundProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  variant?: "default" | "journey";
}

export function ParticlesBackground({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  variant = "default",
}: ParticlesBackgroundProps) {
  const { theme } = useTheme();
  const [color, setColor] = useState("#007AFF");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // Set particle color based on theme
    setColor(theme === "dark" ? "#ffffff" : "#007AFF");
    setRefresh(prev => !prev); // Toggle refresh to redraw particles
  }, [theme]);

  return (
    <Particles
      className={className}
      quantity={quantity}
      staticity={staticity}
      ease={ease}
      size={size}
      color={color}
      refresh={refresh}
      variant={variant}
    />
  );
}
