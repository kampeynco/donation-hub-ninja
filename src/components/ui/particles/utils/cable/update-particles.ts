
import { Circle } from "../../types";

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
