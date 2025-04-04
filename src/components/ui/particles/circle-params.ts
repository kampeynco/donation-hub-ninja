
import { Circle, CanvasSize } from "./types";

/**
 * Generates parameters for a particle circle based on the variant
 */
export function generateCircleParams(
  canvasSize: CanvasSize, 
  variant: "default" | "journey" = "default",
  size: number = 0.4
): Circle {
  if (variant === "journey") {
    // Journey map specific parameters
    const types = ["data", "processed", "insight"];
    const type = types[Math.floor(Math.random() * types.length)];
    const colors = {
      data: "#007AFF", // blue for raw data
      processed: "#4CD964", // green for processed data
      insight: "#FFCC00", // yellow for insights
    };
    
    // Position particles across the canvas with focus on the left side
    const x = Math.floor(Math.random() * canvasSize.w * 0.5); // Start more on the left side
    const y = Math.floor(Math.random() * canvasSize.h);
    const translateX = 0;
    const translateY = 0;
    
    // Adjust size based on particle type and make them more visible
    const pSize = (type === "data" ? 2 : type === "processed" ? 2.5 : 3) * size;
    
    // Begin with zero alpha and gradually increase to target
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.2).toFixed(1)); // Increased opacity
    
    // Data flows faster from left to right with appropriate speeds
    const dx = (Math.random() * 0.8 + 0.3) * (type === "data" ? 1.5 : type === "processed" ? 1 : 0.5);
    const dy = (Math.random() - 0.5) * 0.1; // Slight vertical movement
    
    // Make particles respond to mouse movement
    const magnetism = 0.5 + Math.random() * 2;
    
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      color: colors[type as keyof typeof colors],
      type
    };
  } else {
    // Default parameters
    const x = Math.floor(Math.random() * canvasSize.w);
    const y = Math.floor(Math.random() * canvasSize.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  }
}
