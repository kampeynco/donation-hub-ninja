
import { generateCircleParams } from "../../circle-params";
import { renderCablePaths, updateCableParticles } from "../cable";
import { CanvasSize, Circle } from "../../types";

/**
 * Initializes cable particles
 */
export function initCableParticles(
  context: CanvasRenderingContext2D,
  quantity: number,
  canvasSize: React.MutableRefObject<CanvasSize>,
  drawCircle: (context: CanvasRenderingContext2D, circle: Circle, update?: boolean) => void,
  size: number,
  cablePaths?: { path: Path2D; length: number; points: { x: number; y: number }[]; color: string; width: number }[]
) {
  // If cable variant and paths exist, draw the cable paths
  if (cablePaths && cablePaths.length > 0) {
    renderCablePaths(context, cablePaths);
    
    // Create particles that follow the paths
    for (let i = 0; i < quantity; i++) {
      const circle = generateCircleParams(canvasSize.current, "cable", size, cablePaths);
      drawCircle(context, circle);
    }
  }
}

/**
 * Animates cable particles
 */
export function animateCableParticles(
  context: CanvasRenderingContext2D,
  circles: React.MutableRefObject<Circle[]>,
  canvasSize: React.MutableRefObject<CanvasSize>,
  drawCircle: (context: CanvasRenderingContext2D, circle: Circle, update?: boolean) => void,
  cablePaths?: { path: Path2D; length: number; points: { x: number; y: number }[]; color: string; width: number }[]
) {
  // If cable variant and paths exist
  if (cablePaths && cablePaths.length > 0) {
    // Clear context
    context.globalAlpha = 1;
    
    // Draw the cable paths
    renderCablePaths(context, cablePaths);
    
    // Update cable particles
    updateCableParticles(circles.current);
    
    // Draw the particles
    circles.current.forEach((circle, i) => {
      drawCircle(context, circle, true);
      
      // If particle completed its journey, reset it
      if (circle.pathProgress && circle.pathProgress >= 1) {
        circles.current.splice(i, 1);
        const newCircle = generateCircleParams(canvasSize.current, "cable", circle.size, cablePaths);
        drawCircle(context, newCircle);
      }
    });
  }
}
