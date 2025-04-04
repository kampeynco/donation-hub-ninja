
import { CanvasRefs, Circle } from "./types";
import { hexToRgb, remapValue } from "./utils";

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
  size: number
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
    circle.x += circle.dx + vx;
    circle.y += circle.dy + vy;
    circle.translateX +=
      (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
      ease;
    circle.translateY +=
      (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
      ease;

    drawCircle(circle, context.current, rgb, dpr, true);

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
      const newCircle = createCircleParams(canvasSize.current, size);
      drawCircle(newCircle, context.current, rgb, dpr, false, circles.current);
    }
  });

  // After all particles are drawn, draw the connections
  drawConnections(
    refs,
    showConnections,
    connectionDistance,
    connectionOpacity,
    connectionWidth,
    rgb
  );
}

/**
 * Clears canvas context
 */
export function clearContext(refs: CanvasRefs) {
  const { context, canvasSize } = refs;
  
  if (context.current) {
    context.current.clearRect(
      0,
      0,
      canvasSize.current.w,
      canvasSize.current.h
    );
  }
}
