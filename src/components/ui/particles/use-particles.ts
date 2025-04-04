
import { useRef, useEffect } from "react";
import { Circle, CanvasRefs, CanvasSize } from "./types";
import { hexToRgb } from "./utils";
import { 
  resizeCanvas,
  clearContext 
} from "./canvas-operations";
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
  refresh
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  context: React.RefObject<CanvasRenderingContext2D | null>;
  circles: React.RefObject<Circle[]>;
  mouse: React.RefObject<{ x: number; y: number }>;
  canvasSize: React.RefObject<CanvasSize>;
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

  // Initialize canvas and context
  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    
    // Initialize canvas
    initCanvas();
    
    // Start animation loop
    startAnimationLoop();
    
    // Add resize listener
    window.addEventListener("resize", initCanvas);

    // Cleanup
    return () => {
      window.removeEventListener("resize", initCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [color]);

  // Handle refresh prop changes
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
  const startAnimationLoop = () => {
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
      
      animationFrameId.current = window.requestAnimationFrame(animate);
    };

    animate();
  };

  return {
    initCanvas,
  };
}
