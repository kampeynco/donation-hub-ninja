
import { Circle, CablePath } from "../types";
import { createCurvePath, getCharacterPositions } from "./text-position-utils";

/**
 * Creates multiple cable paths connecting from left side to a target letter
 * and from another target letter to the right side
 */
export function createCablePaths(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  targetTextIds: string[],
  startChar: string = "D",
  endChar: string = "p",
  numLeftCables: number = 4,
  canvasSize: { w: number; h: number }
) {
  const paths: { path: Path2D; length: number; points: any[]; color: string; width: number }[] = [];
  
  if (!canvasRef.current) return paths;
  
  const canvasRect = canvasRef.current.getBoundingClientRect();
  
  // Get target elements
  const targetElements = targetTextIds.map(id => document.getElementById(id));
  
  // Get character positions
  let allCharPositions: any[] = [];
  targetElements.forEach(element => {
    if (element) {
      const positions = getCharacterPositions(element, [startChar, endChar]);
      allCharPositions = [...allCharPositions, ...positions];
    }
  });
  
  // Find our start and end character positions
  const startPositions = allCharPositions.filter(pos => pos.char === startChar);
  const endPositions = allCharPositions.filter(pos => pos.char === endChar);
  
  if (startPositions.length === 0 || endPositions.length === 0) {
    console.warn("Could not find target characters in text");
    return paths;
  }
  
  // Use the first found position for each character
  const startPos = startPositions[0];
  const endPos = endPositions[0];
  
  // Create multiple cables from left side to start character
  for (let i = 0; i < numLeftCables; i++) {
    // Randomize starting positions along the left edge
    const startY = canvasRect.top + (canvasSize.h * (0.3 + Math.random() * 0.4));
    const startX = canvasRect.left + 5;  // Slightly offset from the edge
    
    // Create cable path
    const curvature = 0.3 + Math.random() * 0.4;
    const { path, length, points } = createCurvePath(
      startX,
      startY,
      startPos.x,
      startPos.y,
      curvature,
      canvasRect
    );
    
    // Add color and width variations
    const color = i % 2 === 0 ? "#007AFF" : "#4CD964";
    const width = (1 + Math.random()) * 0.5;
    
    paths.push({ path, length, points, color, width });
  }
  
  // Create a cable from end character to right side
  const endX = canvasRect.left + canvasSize.w - 5;  // Slightly offset from the edge
  const endY = canvasRect.top + canvasSize.h * 0.5;
  
  const { path, length, points } = createCurvePath(
    endPos.x,
    endPos.y,
    endX,
    endY,
    0.5,
    canvasRect
  );
  
  paths.push({ 
    path, 
    length, 
    points, 
    color: "#FFCC00", 
    width: 1.2 
  });
  
  return paths;
}

/**
 * Renders cable paths to the canvas
 */
export function renderCablePaths(
  context: CanvasRenderingContext2D,
  paths: { path: Path2D; color: string; width: number }[]
) {
  context.save();
  
  // Render each cable path
  paths.forEach(({ path, color, width }) => {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.globalAlpha = 0.3;  // Make cables semi-transparent
    context.stroke(path);
  });
  
  context.restore();
}

/**
 * Updates cable particles along their paths
 */
export function updateCableParticles(circles: Circle[]) {
  circles.forEach(circle => {
    if (circle.pathProgress !== undefined && circle.pathSpeed !== undefined) {
      // Update progress along the path
      circle.pathProgress += circle.pathSpeed;
      
      // Reset when reaching the end
      if (circle.pathProgress > 1) {
        circle.pathProgress = 0;
        
        // Randomize alpha for next journey
        circle.alpha = 0;
        circle.targetAlpha = parseFloat((Math.random() * 0.7 + 0.3).toFixed(1));
      }
      
      // Fade in at start, fade out at end
      if (circle.pathProgress < 0.1) {
        // Fade in
        circle.alpha = (circle.pathProgress / 0.1) * circle.targetAlpha;
      } else if (circle.pathProgress > 0.9) {
        // Fade out
        circle.alpha = ((1 - circle.pathProgress) / 0.1) * circle.targetAlpha;
      } else if (circle.alpha < circle.targetAlpha) {
        // Ensure we've reached target alpha
        circle.alpha = Math.min(circle.alpha + 0.01, circle.targetAlpha);
      }
    }
  });
}
