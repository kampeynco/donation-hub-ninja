
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
  } else if (variant === "journey") {
    // Journey variant has three distinct particle types with different sizes
    const rand = Math.random();
    if (rand < 0.33) {
      // Raw data points are small
      pSize = Math.random() * 1 + size * 0.6;
    } else if (rand < 0.66) {
      // Processed data points are medium
      pSize = Math.random() * 1.5 + size;
    } else {
      // Insight data points are larger
      pSize = Math.random() * 2 + size * 1.5;
    }
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
  } else if (variant === "journey") {
    // Journey particles have more constrained movement
    // They mostly flow from left to right with slight vertical movement
    dx = Math.random() * 0.1 + 0.05; // Always move right
    dy = (Math.random() - 0.5) * 0.05; // Small up/down variation
  }
  
  const magnetism = 0.1 + Math.random() * 4;
  
  // Create the basic circle object
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
  
  // Add variant-specific properties
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
  } else if (variant === "journey") {
    // For journey variant, define particle type and stage
    const rand = Math.random();
    
    // Distribute particles into three types
    if (rand < 0.3) {
      circle.particleType = "raw";
      circle.journeyStage = 0;
      circle.color = [132, 138, 156]; // Gray for raw data
    } else if (rand < 0.6) {
      circle.particleType = "processed";
      circle.journeyStage = 1;
      circle.color = [0, 122, 255]; // Blue for processed data
    } else {
      circle.particleType = "insight";
      circle.journeyStage = 2;
      circle.color = [76, 217, 100]; // Green for insights
    }
    
    // Set transition speed for smooth movement
    circle.transitionSpeed = 0.02 + Math.random() * 0.03;
    
    // Position particles according to their stage
    // Raw data on the left, insights on the right
    if (circle.journeyStage === 0) {
      circle.x = Math.random() * (canvasSize.w * 0.3); // Left third
    } else if (circle.journeyStage === 1) {
      circle.x = canvasSize.w * 0.3 + Math.random() * (canvasSize.w * 0.4); // Middle
    } else {
      circle.x = canvasSize.w * 0.7 + Math.random() * (canvasSize.w * 0.3); // Right third
    }
    
    // Set target positions for journey animation
    circle.targetX = circle.x + (Math.random() - 0.5) * 100;
    circle.targetY = circle.y + (Math.random() - 0.5) * 100;
    
    // Some particles are fixed to create anchors in the visualization
    circle.fixed = Math.random() < 0.2;
    if (circle.fixed) {
      circle.dx = 0;
      circle.dy = 0;
    }
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
  } else if (variant === "journey" && circle.particleType === "insight") {
    // Insight particles have a star/diamond shape
    const starPoints = 4;
    const outerRadius = size;
    const innerRadius = size / 2;
    
    for (let i = 0; i < starPoints * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * 2 * i) / (starPoints * 2);
      const pointX = x + Math.cos(angle) * radius;
      const pointY = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        context.moveTo(pointX, pointY);
      } else {
        context.lineTo(pointX, pointY);
      }
    }
    context.closePath();
  } else {
    // Default is a circle
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
  
  // Add glow effect for journey insight particles
  if (variant === "journey" && circle.particleType === "insight" && alpha > 0.3) {
    context.beginPath();
    context.arc(x, y, size * 1.8, 0, 2 * Math.PI);
    context.fillStyle = `rgba(${circle.color ? circle.color.join(", ") : rgb.join(", ")}, ${alpha * 0.15})`;
    context.fill();
  }
  
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (!update && circles) {
    circles.push(circle);
  }
}
