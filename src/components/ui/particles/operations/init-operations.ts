
import { CanvasRefs } from "../types";
import { drawCircle, createCircleParams } from "./circle-operations";
import { clearContext } from "../canvas-operations";

/**
 * Draws all initial particles
 */
export function drawParticles(
  refs: CanvasRefs,
  quantity: number,
  size: number,
  rgb: number[],
  dpr: number,
  variant: string = "default"
) {
  const { context, circles, canvasSize } = refs;
  
  clearContext(refs);
  
  if (!context.current) return;
  
  // Adjust quantity based on variant
  let particleQuantity = quantity;
  if (variant === "nebula") {
    particleQuantity = Math.floor(quantity * 0.7); // Fewer but larger particles for nebula
  } else if (variant === "cosmic") {
    particleQuantity = Math.floor(quantity * 1.2); // More particles for cosmic effect
  } else if (variant === "journey") {
    particleQuantity = Math.floor(quantity * 1.5); // More particles for journey visualization
  }
  
  for (let i = 0; i < particleQuantity; i++) {
    const circle = createCircleParams(canvasSize.current, size, variant);
    drawCircle(circle, context.current, rgb, dpr, false, circles.current, variant);
  }
}
