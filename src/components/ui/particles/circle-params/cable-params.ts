
import { Circle, CanvasSize } from "../types";

/**
 * Generates parameters for a cable particle
 */
export function generateCableParams(
  canvasSize: CanvasSize,
  size: number = 0.4,
  paths?: { path: Path2D; length: number; points: { x: number; y: number }[] }[]
): Circle {
  if (!paths || paths.length === 0) {
    // Fallback if no paths provided
    return {
      x: 0,
      y: 0,
      translateX: 0,
      translateY: 0,
      size: size,
      alpha: 0.1,
      targetAlpha: 0.5,
      dx: 0,
      dy: 0,
      magnetism: 0
    };
  }
  
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
}
