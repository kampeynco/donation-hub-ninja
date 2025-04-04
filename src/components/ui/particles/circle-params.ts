import { Circle, CanvasSize } from "./types";

/**
 * Generates parameters for a particle circle based on the variant
 */
export function generateCircleParams(
  canvasSize: CanvasSize, 
  variant: "default" | "journey" | "cable" = "default",
  size: number = 0.4,
  paths?: { path: Path2D; length: number; points: { x: number; y: number }[] }[]
): Circle {
  if (variant === "cable" && paths && paths.length > 0) {
    // Select a random path for this particle
    const pathIndex = Math.floor(Math.random() * paths.length);
    const selectedPath = paths[pathIndex];
    
    // Cable visualization specific parameters
    const colors = ["#007AFF", "#4CD964", "#FFCC00"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Set the particle at the start of the path
    const pSize = (Math.random() * 1.5 + 1) * size;
    
    // Initial alpha and target alpha
    const alpha = 0.1;
    const targetAlpha = parseFloat((Math.random() * 0.7 + 0.3).toFixed(1));
    
    // Path progress starts at 0 (beginning of path)
    const pathProgress = 0;
    
    // Random speed for variety
    const pathSpeed = (Math.random() * 0.005 + 0.002);
    
    // The magnetism is irrelevant for cable particles
    const magnetism = 0;
    
    return {
      x: 0, // These x/y values are not used directly, as the particle position comes from the path
      y: 0,
      translateX: 0,
      translateY: 0,
      size: pSize,
      alpha,
      targetAlpha,
      dx: 0, // No direct movement, we'll use path progress
      dy: 0,
      magnetism,
      color,
      path: selectedPath.path,
      pathProgress,
      pathSpeed,
      pathLength: selectedPath.length
    };
  } else if (variant === "journey") {
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
