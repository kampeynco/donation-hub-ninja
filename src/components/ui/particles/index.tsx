
import { cn } from "@/lib/utils";
import React from "react";
import { ParticlesProps } from "./types";
import { useParticlesAnimation } from "./use-particles-animation";

export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  variant = "default",
}) => {
  const { canvasRef, canvasContainerRef } = useParticlesAnimation({
    quantity,
    staticity,
    ease,
    size,
    color,
    vx,
    vy,
    variant,
    refresh
  });

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};
