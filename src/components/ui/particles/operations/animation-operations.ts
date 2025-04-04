
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
    }
    
    circle.x += circle.dx + vx;
    circle.y += circle.dy + vy;
    circle.translateX +=
      (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
      ease;
    circle.translateY +=
      (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
      ease;

    drawCircle(circle, context.current, rgb, dpr, true, undefined, variant);

    // circle gets out of the canvas
    if (
      circle.x < -circle.size ||
      circle.x > canvasSize.current.w + circle.size ||
      circle.y < -circle.size ||
      circle.y > canvasSize.current.h + circle.size
    ) {
      // remove the circle from the array
      circles.current.splice(i, 1);
      // create a new circle
      const newCircle = createCircleParams(canvasSize.current, size, variant);
      drawCircle(newCircle, context.current, rgb, dpr, false, circles.current, variant);
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
