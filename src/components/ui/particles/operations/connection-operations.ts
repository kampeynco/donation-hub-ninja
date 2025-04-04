
import { CanvasRefs, Circle } from "../types";

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
  if (!showConnections || !refs.context.current) return;
  
  const { circles, context } = refs;
  
  // For each circle
  for (let i = 0; i < circles.current.length; i++) {
    // Compare with all other circles
    for (let j = i + 1; j < circles.current.length; j++) {
      const circle1 = circles.current[i];
      const circle2 = circles.current[j];
      
      // Calculate distance between circles
      const dx = circle1.x + circle1.translateX - (circle2.x + circle2.translateX);
      const dy = circle1.y + circle1.translateY - (circle2.y + circle2.translateY);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If circles are close enough, draw a connection
      if (distance < connectionDistance) {
        // Calculate opacity based on distance
        const opacity =
          ((1 - distance / connectionDistance) *
            connectionOpacity *
            Math.min(circle1.alpha, circle2.alpha)).toFixed(2);
        
        // Start drawing the connection
        context.current.beginPath();
        context.current.moveTo(
          circle1.x + circle1.translateX,
          circle1.y + circle1.translateY
        );

        // In journey variant, draw curved connections between different particle types
        if (variant === "journey" && 
            circle1.particleType && 
            circle2.particleType && 
            circle1.particleType !== circle2.particleType) {
          
          // Draw a curved line for the journey connections
          const midX = (circle1.x + circle2.x) / 2;
          const midY = (circle1.y + circle2.y) / 2;
          
          // Curve control point - pull towards the right for flow direction
          const ctrlX = midX + Math.abs(dy) * 0.3;
          const ctrlY = midY;
          
          // Use quadratic curve
          context.current.quadraticCurveTo(
            ctrlX, 
            ctrlY, 
            circle2.x + circle2.translateX, 
            circle2.y + circle2.translateY
          );

          // Determine color based on particle types
          let lineColor;
          if ((circle1.particleType === "raw" && circle2.particleType === "processed") ||
              (circle1.particleType === "processed" && circle2.particleType === "raw")) {
            // Connection between raw and processed: blue gradient
            const gradient = context.current.createLinearGradient(
              circle1.x + circle1.translateX,
              circle1.y + circle1.translateY,
              circle2.x + circle2.translateX,
              circle2.y + circle2.translateY
            );
            
            if (circle1.particleType === "raw") {
              gradient.addColorStop(0, `rgba(132, 138, 156, ${opacity})`);
              gradient.addColorStop(1, `rgba(0, 122, 255, ${opacity})`);
            } else {
              gradient.addColorStop(0, `rgba(0, 122, 255, ${opacity})`);
              gradient.addColorStop(1, `rgba(132, 138, 156, ${opacity})`);
            }
            
            lineColor = gradient;
          } else if ((circle1.particleType === "processed" && circle2.particleType === "insight") ||
                    (circle1.particleType === "insight" && circle2.particleType === "processed")) {
            // Connection between processed and insight: blue to green gradient
            const gradient = context.current.createLinearGradient(
              circle1.x + circle1.translateX,
              circle1.y + circle1.translateY,
              circle2.x + circle2.translateX,
              circle2.y + circle2.translateY
            );
            
            if (circle1.particleType === "processed") {
              gradient.addColorStop(0, `rgba(0, 122, 255, ${opacity})`);
              gradient.addColorStop(1, `rgba(76, 217, 100, ${opacity})`);
            } else {
              gradient.addColorStop(0, `rgba(76, 217, 100, ${opacity})`);
              gradient.addColorStop(1, `rgba(0, 122, 255, ${opacity})`);
            }
            
            lineColor = gradient;
          } else {
            // Connection between raw and insight: gray to green gradient
            const gradient = context.current.createLinearGradient(
              circle1.x + circle1.translateX,
              circle1.y + circle1.translateY,
              circle2.x + circle2.translateX,
              circle2.y + circle2.translateY
            );
            
            if (circle1.particleType === "raw") {
              gradient.addColorStop(0, `rgba(132, 138, 156, ${opacity})`);
              gradient.addColorStop(1, `rgba(76, 217, 100, ${opacity})`);
            } else {
              gradient.addColorStop(0, `rgba(76, 217, 100, ${opacity})`);
              gradient.addColorStop(1, `rgba(132, 138, 156, ${opacity})`);
            }
            
            lineColor = gradient;
          }
          
          context.current.strokeStyle = lineColor;
          context.current.lineWidth = connectionWidth * 1.5; // Slightly thicker for journey connections
        } else {
          // For other variants or same particle types, draw straight lines
          context.current.lineTo(
            circle2.x + circle2.translateX,
            circle2.y + circle2.translateY
          );
          
          // Basic connection color
          if (variant === "journey" && circle1.color && circle2.color) {
            // In journey variant, use particle colors for connections between same types
            const color1 = circle1.color;
            const color2 = circle2.color;
            
            // Create a gradient between the two colors
            const gradient = context.current.createLinearGradient(
              circle1.x + circle1.translateX,
              circle1.y + circle1.translateY,
              circle2.x + circle2.translateX,
              circle2.y + circle2.translateY
            );
            
            gradient.addColorStop(0, `rgba(${color1.join(", ")}, ${opacity})`);
            gradient.addColorStop(1, `rgba(${color2.join(", ")}, ${opacity})`);
            
            context.current.strokeStyle = gradient;
          } else {
            // Default connection color
            context.current.strokeStyle = `rgba(${rgb.join(", ")}, ${opacity})`;
          }
          
          context.current.lineWidth = connectionWidth;
        }
        
        context.current.stroke();
      }
    }
  }
}
