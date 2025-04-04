
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
  rgb: number[],
  variant: string = "default"
) {
  const { context, circles, canvasSize } = refs;
  
  if (!context.current || !showConnections) return;
  
  // Variant-specific connection settings
  let distance = connectionDistance;
  let opacity = connectionOpacity;
  let width = connectionWidth;
  
  if (variant === "grid") {
    // Grid has more structured connections
    distance = connectionDistance * 0.7;
    opacity = connectionOpacity * 1.2;
  } else if (variant === "nebula") {
    // Nebula has longer, more transparent connections
    distance = connectionDistance * 1.5;
    opacity = connectionOpacity * 0.7;
  } else if (variant === "cosmic") {
    // Cosmic has colorful, thicker connections
    distance = connectionDistance * 1.3;
    opacity = connectionOpacity * 1.2;
    width = connectionWidth * 1.5;
  }
  
  for (let i = 0; i < circles.current.length; i++) {
    for (let j = i + 1; j < circles.current.length; j++) {
      const circle1 = circles.current[i];
      const circle2 = circles.current[j];
      
      const dx = circle1.x + circle1.translateX - (circle2.x + circle2.translateX);
      const dy = circle1.y + circle1.translateY - (circle2.y + circle2.translateY);
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < distance) {
        const alpha = (1 - dist / distance) * opacity;
        
        context.current.beginPath();
        context.current.moveTo(
          circle1.x + circle1.translateX,
          circle1.y + circle1.translateY
        );
        context.current.lineTo(
          circle2.x + circle2.translateX,
          circle2.y + circle2.translateY
        );
        
        if (variant === "cosmic" && circle1.color && circle2.color) {
          // Cosmic connections use gradient between particle colors
          const gradient = context.current.createLinearGradient(
            circle1.x + circle1.translateX,
            circle1.y + circle1.translateY,
            circle2.x + circle2.translateX,
            circle2.y + circle2.translateY
          );
          gradient.addColorStop(0, `rgba(${circle1.color.join(",")}, ${alpha})`);
          gradient.addColorStop(1, `rgba(${circle2.color.join(",")}, ${alpha})`);
          context.current.strokeStyle = gradient;
        } else {
          context.current.strokeStyle = `rgba(${rgb.join(",")}, ${alpha})`;
        }
        
        context.current.lineWidth = width;
        context.current.stroke();
      }
    }
  }
}
