import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Particles } from "./particles";

export interface ParticlesBackgroundProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  showConnections?: boolean;
  connectionDistance?: number;
  connectionOpacity?: number;
  connectionWidth?: number;
  variant?: "default" | "nebula" | "wave" | "grid" | "cosmic" | "journey";
}

export function ParticlesBackground({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  showConnections = true,
  connectionDistance = 100,
  connectionOpacity = 0.2,
  connectionWidth = 0.5,
  variant = "default",
}: ParticlesBackgroundProps) {
  const { theme } = useTheme();
  const [color, setColor] = useState("#007AFF");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // Set particle color based on theme and variant
    if (variant === "journey") {
      // Journey variant uses predefined colors for the different stages
      setColor("#007AFF"); // Base color, will be overridden by particle types
    } else {
      // Other variants use theme-based coloring
      setColor(theme === "dark" ? "#ffffff" : "#007AFF");
    }
    setRefresh(prev => !prev); // Toggle refresh to redraw particles
  }, [theme, variant]);

  return (
    <Particles
      className={className}
      quantity={quantity}
      staticity={staticity}
      ease={ease}
      size={size}
      color={color}
      refresh={refresh}
      showConnections={showConnections}
      connectionDistance={connectionDistance}
      connectionOpacity={connectionOpacity}
      connectionWidth={connectionWidth}
      variant={variant}
    />
  );
}
