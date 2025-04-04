
import { ParticleRendererProps } from "../types";
import { hexToRgb } from "../utils";

export function renderCableParticle({
  context,
  circle,
  update = false,
  dpr
}: ParticleRendererProps): void {
  const { size, alpha, path, pathProgress = 0 } = circle;
  
  if (!path) return;
  
  // Save the current canvas state
  context.save();
  
  // Set the fill style based on the circle's color or a default
  const rgb = hexToRgb(circle.color || "#ffffff");
  context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
  
  // Calculate point on the path
  if (pathProgress !== undefined && path) {
    // Move along the path
    const point = getPointOnPath(path, pathProgress);
    
    if (point) {
      // Draw the particle at the calculated point
      context.beginPath();
      context.arc(point.x, point.y, size, 0, Math.PI * 2);
      context.fill();
      
      // Add a subtle glow effect
      const glowSize = size * 3;
      const gradient = context.createRadialGradient(
        point.x, point.y, size,
        point.x, point.y, glowSize
      );
      gradient.addColorStop(0, `rgba(${rgb.join(", ")}, 0.4)`);
      gradient.addColorStop(1, `rgba(${rgb.join(", ")}, 0)`);
      
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(point.x, point.y, glowSize, 0, Math.PI * 2);
      context.fill();
    }
  }
  
  // Restore the canvas state
  context.restore();
}

function getPointOnPath(path: Path2D, progress: number): { x: number, y: number } | null {
  // This is a fallback method - ideally we should use getPointAtLength
  // But since Path2D doesn't directly support this, we use the path's custom properties
  // attached when creating the particle
  
  // Progress should be between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  // Return a point approximation based on the progress
  // Note: In a real implementation, we would need to have access to the actual path points
  // For now, this is a simplified version
  
  try {
    // Access our custom properties - these must be set when creating the particle
    const pathPoints = (path as any)._points;
    
    if (pathPoints && pathPoints.length > 1) {
      const totalPoints = pathPoints.length;
      const index = Math.floor(clampedProgress * (totalPoints - 1));
      const nextIndex = Math.min(index + 1, totalPoints - 1);
      
      const pointProgress = (clampedProgress * (totalPoints - 1)) - index;
      
      // Interpolate between the current and next points
      return {
        x: pathPoints[index].x + (pathPoints[nextIndex].x - pathPoints[index].x) * pointProgress,
        y: pathPoints[index].y + (pathPoints[nextIndex].y - pathPoints[index].y) * pointProgress
      };
    }
    
    // Fallback: just return the position stored in the circle itself
    return null;
  } catch (e) {
    console.error("Error getting point on path:", e);
    return null;
  }
}
