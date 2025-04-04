
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
  refresh
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
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        context.current = ctx;
      }
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
      stopAnimationLoop();
    };
  }, [color]);

  // Handle refresh prop changes
  useEffect(() => {
    initCanvas();
  }, [refresh]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopAnimationLoop();
    };
  }, []);

  // Initialize the canvas
  const initCanvas = () => {
    resizeCanvas(refs);
    
    // Convert color to RGB for use in drawing
    const rgb = hexToRgb(color);
    
    drawParticles(refs, quantity, size, rgb, dpr);
  };

  // Stop animation loop and cancel any pending animation frames
  const stopAnimationLoop = () => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  // Animation loop
  const startAnimationLoop = () => {
    // First, stop any existing animation loop
    stopAnimationLoop();
    
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
