
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { ParticlesProps, CanvasRefs, Circle, CanvasSize, MousePosition } from "./types";
import { hexToRgb } from "./utils";
import { useMousePosition } from "./use-mouse-position";
import { 
  resizeCanvas, 
  updateMousePosition, 
  clearContext 
} from "./canvas-operations";
import { 
  drawParticles, 
  animateParticles 
} from "./particle-operations";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<CanvasSize>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  // Group refs for easier passing to functions
  const refs: CanvasRefs = {
    canvasRef,
    canvasContainerRef,
    context,
    circles,
    mouse,
    canvasSize
  };

  // Initialize canvas and start animation
  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [color]);

  // Update mouse position when it moves
  useEffect(() => {
    updateMousePosition(mousePosition, refs);
  }, [mousePosition.x, mousePosition.y]);

  // Refresh canvas when refresh prop changes
  useEffect(() => {
    initCanvas();
  }, [refresh]);

  // Initialize the canvas
  const initCanvas = () => {
    resizeCanvas(refs);
    
    // Convert color to RGB for use in drawing
    const rgb = hexToRgb(color);
    
    drawParticles(refs, quantity, size, rgb, dpr);
  };

  // Animation loop
  const animate = () => {
    const rgb = hexToRgb(color);
    
    animateParticles(
      refs,
      staticity,
      ease,
      vx,
      vy,
      rgb,
      dpr,
      showConnections,
      connectionDistance,
      connectionOpacity,
      connectionWidth,
      size
    );
    
    window.requestAnimationFrame(animate);
  };

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
