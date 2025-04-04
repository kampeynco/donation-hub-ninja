
import { Circle } from "../types";

/**
 * Creates parameters for a new circle particle
 */
export function createCircleParams(canvasSize: { w: number; h: number }, size: number): Circle {
  const x = Math.floor(Math.random() * canvasSize.w);
  const y = Math.floor(Math.random() * canvasSize.h);
  const translateX = 0;
  const translateY = 0;
  const pSize = Math.floor(Math.random() * 2) + size;
  const alpha = 0;
  const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
  const dx = (Math.random() - 0.5) * 0.1;
  const dy = (Math.random() - 0.5) * 0.1;
  const magnetism = 0.1 + Math.random() * 4;
  
  return {
    x,
    y,
    translateX,
    translateY,
    size: pSize,
    alpha,
    targetAlpha,
    dx,
    dy,
    magnetism,
  };
}

/**
 * Draws a circle on the canvas
 */
export function drawCircle(
  circle: Circle,
  context: CanvasRenderingContext2D,
  rgb: number[],
  dpr: number,
  update = false,
  circles: Circle[] = []
) {
  const { x, y, translateX, translateY, size, alpha } = circle;
  
  context.translate(translateX, translateY);
  context.beginPath();
  context.arc(x, y, size, 0, 2 * Math.PI);
  context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
  context.fill();
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (!update && circles) {
    circles.push(circle);
  }
}
