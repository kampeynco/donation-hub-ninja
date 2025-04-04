
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { ParticlesProps, Circle, CanvasSize } from "./types";
import { useMousePosition } from "./use-mouse-position";
import { useParticles } from "./use-particles";
import { updateMousePosition } from "./canvas-operations";
import { useEffect } from "react";

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  showConnections = true,
  connectionDistance = 100,
  connectionOpacity = 0.2,
  connectionWidth = 0.5,
}) => {
  // Initialize refs for canvas elements and state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<CanvasSize>({ w: 0, h: 0 });

  // Group refs for easier passing to functions
  const refs = {
    canvasRef,
    canvasContainerRef,
    context,
    circles,
    mouse,
    canvasSize
  };

  // Use our particles hook to manage animation
  useParticles({
    ...refs,
    quantity,
    staticity,
    ease,
    size,
    color,
    vx,
    vy,
    showConnections,
    connectionDistance,
    connectionOpacity,
    connectionWidth,
    refresh
  });

  // Update mouse position when it moves
  useEffect(() => {
    updateMousePosition(mousePosition, refs);
  }, [mousePosition.x, mousePosition.y]);

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

export { Particles };
