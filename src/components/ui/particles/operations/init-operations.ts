
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
  dpr: number
) {
  const { context, circles, canvasSize } = refs;
  
  clearContext(refs);
  
  if (!context.current) return;
  
  for (let i = 0; i < quantity; i++) {
    const circle = createCircleParams(canvasSize.current, size);
    drawCircle(circle, context.current, rgb, dpr, false, circles.current);
  }
}
