
import { CanvasRefs, Circle } from "../types";
import { remapValue } from "../utils";
import { drawCircle, createCircleParams } from "./circle-operations";
import { drawConnections } from "./connection-operations";
import { clearContext } from "../canvas-operations";

/**
 * Handles animation frame logic for particles
 */
export function animateParticles(
  refs: CanvasRefs,
  staticity: number,
  ease: number,
  vx: number,
  vy: number,
  rgb: number[],
  dpr: number,
  showConnections: boolean,
  connectionDistance: number,
  connectionOpacity: number,
  connectionWidth: number,
  size: number,
  variant: string = "default"
) {
  const { context, circles, mouse, canvasSize } = refs;
  
  clearContext(refs);
  
  if (!context.current) return;
  
  // Draw all particles first
  circles.current.forEach((circle: Circle, i: number) => {
    // Handle the alpha value
    const edge = [
      circle.x + circle.translateX - circle.size, // distance from left edge
      canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
      circle.y + circle.translateY - circle.size, // distance from top edge
      canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
    ];
    const closestEdge = edge.reduce((a, b) => Math.min(a, b));
    const remapClosestEdge = parseFloat(
      remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
    );
    if (remapClosestEdge > 1) {
      circle.alpha += 0.02;
      if (circle.alpha > circle.targetAlpha) {
        circle.alpha = circle.targetAlpha;
      }
    } else {
      circle.alpha = circle.targetAlpha * remapClosestEdge;
    }
    
    // Variant-specific animation
    if (variant === "wave") {
      // Add sine wave movement to y position
      circle.y += Math.sin(Date.now() / 1000 + circle.x / 100) * 0.2;
    } else if (variant === "cosmic" && circle.pulse !== undefined && circle.pulseSpeed !== undefined) {
      // Update pulse for cosmic variant
      circle.pulse += circle.pulseSpeed;
    } else if (variant === "journey") {
      // Journey-specific animation logic
      if (!circle.fixed) {
        // For non-fixed particles, handle guided movement
        if (circle.targetX !== undefined && circle.targetY !== undefined && circle.transitionSpeed !== undefined) {
          // Move towards target position
          const dx = circle.targetX - circle.x;
          const dy = circle.targetY - circle.y;
          
          circle.x += dx * circle.transitionSpeed;
          circle.y += dy * circle.transitionSpeed;
          
          // When close to target, set a new target
          if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            // Set a new target based on journey stage
            if (circle.journeyStage === 0) {
              // Raw data moves towards processed stage
              circle.targetX = canvasSize.current.w * 0.3 + Math.random() * (canvasSize.current.w * 0.2);
              circle.journeyStage = 1;
              circle.color = [0, 122, 255]; // Change color as it evolves
              circle.particleType = "processed";
            } else if (circle.journeyStage === 1 && Math.random() < 0.01) {
              // Some processed data becomes insights
              circle.targetX = canvasSize.current.w * 0.7 + Math.random() * (canvasSize.current.w * 0.2);
              circle.journeyStage = 2;
              circle.color = [76, 217, 100]; // Change to insight color
              circle.particleType = "insight";
              circle.size = circle.size * 1.5; // Grow as it becomes an insight
            }
            
            // Randomize target Y position
            circle.targetY = Math.random() * canvasSize.current.h;
          }
        }
        
        // Journey particles move according to their stage
        // Raw data has more erratic movement, insights are more directed
        if (circle.journeyStage === 0) {
          circle.x += circle.dx * 0.5;
          circle.y += circle.dy;
        } else if (circle.journeyStage === 1) {
          circle.x += circle.dx * 0.8;
          circle.y += circle.dy * 0.5;
        } else {
          circle.x += circle.dx * 1.2;
          circle.y += circle.dy * 0.3;
        }
        
        // Adjust direction based on mouse position
        circle.translateX +=
          (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
          ease;
        circle.translateY +=
          (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
          ease;
      }
    } else {
      // Default movement
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;
    }
    
    drawCircle(circle, context.current, rgb, dpr, true, undefined, variant);

    // Handle particles that move off the canvas
    if (
      circle.x < -circle.size ||
      circle.x > canvasSize.current.w + circle.size ||
      circle.y < -circle.size ||
      circle.y > canvasSize.current.h + circle.size
    ) {
      // In journey variant, respawn particles with purpose
      if (variant === "journey") {
        // Create a new journey particle with the appropriate stage
        const newCircle = createCircleParams(canvasSize.current, size, variant);
        if (Math.random() < 0.7) {
          // Most new particles are raw data
          newCircle.particleType = "raw";
          newCircle.journeyStage = 0;
          newCircle.color = [132, 138, 156]; // Gray for raw data
          newCircle.x = Math.random() * (canvasSize.current.w * 0.3); // Left third
        }
        
        // Remove the old circle
        circles.current.splice(i, 1);
        
        // Add the new circle
        drawCircle(newCircle, context.current, rgb, dpr, false, circles.current, variant);
      } else {
        // Default behavior for other variants
        // Remove the circle from the array
        circles.current.splice(i, 1);
        // Create a new circle
        const newCircle = createCircleParams(canvasSize.current, size, variant);
        drawCircle(newCircle, context.current, rgb, dpr, false, circles.current, variant);
      }
    }
  });

  // After all particles are drawn, draw the connections
  drawConnections(
    refs,
    showConnections,
    connectionDistance,
    connectionOpacity,
    connectionWidth,
    rgb,
    variant
  );
}
