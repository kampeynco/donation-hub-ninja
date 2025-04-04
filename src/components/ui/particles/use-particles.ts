
import { useRef, useEffect } from "react";
import { Circle, CanvasRefs, CanvasSize } from "./types";
import { hexToRgb } from "./utils";
import { resizeCanvas, clearContext } from "./canvas-operations";
import { 
  drawParticles, 
  animateParticles 
} from "./particle-operations";

/**
 * Hook to manage particle animation and state
 */
export function useParticles({
  canvasRef,
  canvasContainerRef,
  context,
  circles,
  mouse,
  canvasSize,
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
  refresh,
  variant = "default"
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  context: React.MutableRefObject<CanvasRenderingContext2D | null>;
  circles: React.MutableRefObject<Circle[]>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  canvasSize: React.MutableRefObject<CanvasSize>;
  quantity: number;
  staticity: number;
  ease: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  showConnections: boolean;
  connectionDistance: number;
  connectionOpacity: number;
  connectionWidth: number;
  refresh: boolean;
  variant?: "default" | "nebula" | "wave" | "grid" | "cosmic";
}) {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const animationFrameId = useRef<number | null>(null);

  // Group refs for easier passing to functions
  const refs: CanvasRefs = {
    canvasRef,
    canvasContainerRef,
    context,
    circles,
    mouse,
    canvasSize
  };

  /**
   * Initialize the canvas context
   */
  const setupCanvasContext = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        context.current = ctx;
      }
    }
  };

  /**
   * Initialize the canvas
   */
  const initCanvas = () => {
    resizeCanvas(refs);
    
    // Convert color to RGB for use in drawing
    const rgb = hexToRgb(color);
    
    drawParticles(refs, quantity, size, rgb, dpr, variant);
  };

  /**
   * Stop animation loop and cancel any pending animation frames
   */
  const stopAnimationLoop = () => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  /**
   * Create and start the animation loop
   */
  const startAnimationLoop = () => {
    // First, stop any existing animation loop
    stopAnimationLoop();
    
    const animateFrame = () => {
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
        size,
        variant
      );
      
      animationFrameId.current = window.requestAnimationFrame(animateFrame);
    };

    animateFrame();
  };

  // Initialize canvas and context
  useEffect(() => {
    setupCanvasContext();
    initCanvas();
    startAnimationLoop();
    
    // Add resize listener
    window.addEventListener("resize", initCanvas);

    // Cleanup
    return () => {
      window.removeEventListener("resize", initCanvas);
      stopAnimationLoop();
    };
  }, [color, variant]);

  // Handle refresh prop changes
  useEffect(() => {
    initCanvas();
  }, [refresh]);

  // Cleanup when component unmounts
  useEffect(() => {
    return stopAnimationLoop;
  }, []);

  return {
    initCanvas,
  };
}
