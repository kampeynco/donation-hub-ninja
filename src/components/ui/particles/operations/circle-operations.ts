
import { Circle } from "../types";
import { hexToRgb } from "../utils";

/**
 * Creates parameters for a new circle particle
 */
export function createCircleParams(
  canvasSize: { w: number; h: number }, 
  size: number, 
  variant: string = "default"
): Circle {
  const x = Math.floor(Math.random() * canvasSize.w);
  const y = Math.floor(Math.random() * canvasSize.h);
  const translateX = 0;
  const translateY = 0;
  
  // Adjust particle size based on variant
  let pSize = Math.floor(Math.random() * 2) + size;
  if (variant === "cosmic") {
    // Cosmic variant has more size variance
    pSize = Math.random() * 3 + size;
  } else if (variant === "nebula") {
    // Nebula has some larger particles
    pSize = Math.random() < 0.2 ? Math.random() * 4 + size + 1 : Math.random() * 2 + size;
  }
  
  const alpha = 0;
  const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
  
  // Adjust movement based on variant
  let dx = (Math.random() - 0.5) * 0.1;
  let dy = (Math.random() - 0.5) * 0.1;
  
  if (variant === "wave") {
    // Wave particles move in a more horizontal pattern
    dx = (Math.random() - 0.5) * 0.2;
    dy = (Math.random() - 0.5) * 0.05;
  } else if (variant === "grid") {
    // Grid particles move very little
    dx = (Math.random() - 0.5) * 0.05;
    dy = (Math.random() - 0.5) * 0.05;
  } else if (variant === "cosmic") {
    // Cosmic particles move more chaotically
    dx = (Math.random() - 0.5) * 0.3;
    dy = (Math.random() - 0.5) * 0.3;
  }
  
  const magnetism = 0.1 + Math.random() * 4;
  
  // Add variant-specific properties
  const circle: Circle = {
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
  
  // Custom colors for cosmic variant
  if (variant === "cosmic") {
    // Add pulse effect for cosmic
    circle.pulse = 0;
    circle.pulseSpeed = 0.02 + Math.random() * 0.04;
    
    // Random color variations for cosmic
    const colors = [
      [65, 105, 225],  // Royal Blue
      [147, 112, 219], // Medium Purple
      [0, 191, 255],   // Deep Sky Blue
      [255, 105, 180], // Hot Pink
      [255, 215, 0]    // Gold
    ];
    circle.color = colors[Math.floor(Math.random() * colors.length)];
  }
  
  return circle;
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
  circles: Circle[] = [],
  variant: string = "default"
) {
  const { x, y, translateX, translateY, size, alpha } = circle;
  
  context.translate(translateX, translateY);
  context.beginPath();
  
  if (variant === "grid" && !update) {
    // Grid particles are squares
    context.rect(x - size/2, y - size/2, size, size);
  } else {
    context.arc(x, y, size, 0, 2 * Math.PI);
  }
  
  // Use circle's custom color if available, otherwise use the provided RGB
  let fillColor;
  if (circle.color) {
    fillColor = `rgba(${circle.color.join(", ")}, ${alpha})`;
  } else {
    fillColor = `rgba(${rgb.join(", ")}, ${alpha})`;
  }
  
  // Apply pulse effect for cosmic variant
  if (variant === "cosmic" && circle.pulse !== undefined) {
    const pulseSize = size * (1 + Math.sin(circle.pulse) * 0.2);
    context.arc(x, y, pulseSize, 0, 2 * Math.PI);
  }
  
  context.fillStyle = fillColor;
  context.fill();
  
  // Add glow effect for cosmic variant
  if (variant === "cosmic" && circle.color && alpha > 0.3) {
    context.beginPath();
    context.arc(x, y, size * 1.5, 0, 2 * Math.PI);
    context.fillStyle = `rgba(${circle.color.join(", ")}, ${alpha * 0.2})`;
    context.fill();
  }
  
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (!update && circles) {
    circles.push(circle);
  }
}
