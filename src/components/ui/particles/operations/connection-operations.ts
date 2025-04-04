
import { CanvasRefs } from "../types";

/**
 * Draws connections between particles
 */
export function drawConnections(
  refs: CanvasRefs,
  showConnections: boolean,
  connectionDistance: number,
  connectionOpacity: number,
  connectionWidth: number,
  rgb: number[]
) {
  const { context, circles } = refs;
  
  if (!context.current || !showConnections) return;

  const { length } = circles.current;
  for (let i = 0; i < length; i++) {
    const circle1 = circles.current[i];
    const x1 = circle1.x + circle1.translateX;
    const y1 = circle1.y + circle1.translateY;

    for (let j = i + 1; j < length; j++) {
      const circle2 = circles.current[j];
      const x2 = circle2.x + circle2.translateX;
      const y2 = circle2.y + circle2.translateY;
      
      const distance = Math.sqrt(
        Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
      );
      
      if (distance < connectionDistance) {
        // Draw connection with opacity based on distance
        const opacity = connectionOpacity * (1 - distance / connectionDistance);
        context.current.beginPath();
        context.current.moveTo(x1, y1);
        context.current.lineTo(x2, y2);
        context.current.strokeStyle = `rgba(${rgb.join(", ")}, ${opacity})`;
        context.current.lineWidth = connectionWidth;
        context.current.stroke();
      }
    }
  }
}
