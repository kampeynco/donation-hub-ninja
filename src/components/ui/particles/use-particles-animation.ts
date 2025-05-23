
import { useCallback, useEffect, useRef } from "react";
import { Circle, CanvasSize } from "./types";
import { useMousePosition } from "./use-mouse-position";
import { useCanvasManagement } from "./utils/canvas-utils";
import { useParticleAnimation } from "./utils/animation/use-particle-animation";
import { useMouseTracking } from "./utils/mouse-utils";
import { useCablePaths } from "./use-cable-paths";

interface UseParticlesAnimationProps {
  quantity: number;
  staticity: number;
  ease: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  variant: "default" | "journey" | "cable" | "network";
  refresh: boolean;
  targetTexts?: string[];
}

export const useParticlesAnimation = ({
  quantity,
  staticity,
  ease,
  size,
  color,
  vx,
  vy,
  variant,
  refresh,
  targetTexts = ["hero-title"]
}: UseParticlesAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<CanvasSize>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  
  // Get cable paths if using cable variant
  const cablePaths = variant === "cable" 
    ? useCablePaths(canvasRef, canvasSize, targetTexts, "D", "p", 4) 
    : undefined;
  
  // Use our utility hooks
  const { clearContext, resizeCanvas } = useCanvasManagement(canvasRef, canvasContainerRef, canvasSize, dpr);
  const { drawCircle, initParticles, animateParticles } = useParticleAnimation(
    variant, circles, mouse, canvasSize, staticity, ease, size, vx, vy, dpr, cablePaths
  );
  const { trackMousePosition } = useMouseTracking(canvasRef, mouse, canvasSize, mousePosition);

  /**
   * Draws particles on the canvas
   */
  const drawParticles = useCallback(() => {
    if (context.current) {
      clearContext(context.current);
      circles.current = []; // Clear the circles array
      initParticles(context.current, quantity);
    }
  }, [clearContext, initParticles, quantity]);

  /**
   * Initializes canvas and draws particles
   */
  const initCanvas = useCallback(() => {
    if (context.current) {
      resizeCanvas(context.current);
      drawParticles();
    }
  }, [drawParticles, resizeCanvas]);

  /**
   * Animation loop
   */
  const animate = useCallback(() => {
    if (context.current) {
      clearContext(context.current);
      animateParticles(context.current);
      window.requestAnimationFrame(animate);
    }
  }, [animateParticles, clearContext]);

  // Initialize canvas and context
  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    if (context.current) {
      initCanvas();
      animate();
    }
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [animate, initCanvas]);

  // Track mouse position
  useEffect(() => {
    trackMousePosition();
  }, [mousePosition, trackMousePosition]);

  // Refresh particles when requested
  useEffect(() => {
    initCanvas();
  }, [initCanvas, refresh, cablePaths]);

  return {
    canvasRef,
    canvasContainerRef
  };
};
