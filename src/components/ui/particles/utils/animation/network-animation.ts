
import { 
  generateCircleParams, 
  createNetworkConnections, 
  createDataPackets, 
  updateDataPackets 
} from "../../circle-params";
import { renderNetworkConnections } from "../../renderers";
import { remapValue } from "../../utils";
import { CanvasSize, Circle } from "../../types";

/**
 * Initializes network particles
 */
export function initNetworkParticles(
  context: CanvasRenderingContext2D,
  quantity: number,
  canvasSize: React.MutableRefObject<CanvasSize>,
  drawCircle: (context: CanvasRenderingContext2D, circle: Circle, update?: boolean) => void,
  circles: React.MutableRefObject<Circle[]>,
  size: number
) {
  // Create network nodes
  for (let i = 0; i < quantity; i++) {
    const circle = generateCircleParams(canvasSize.current, "network", size);
    drawCircle(context, circle);
  }
  
  // Create connections between nodes
  createNetworkConnections(circles.current);
}

/**
 * Animates network particles
 */
export function animateNetworkParticles(
  context: CanvasRenderingContext2D,
  circles: React.MutableRefObject<Circle[]>,
  canvasSize: React.MutableRefObject<CanvasSize>,
  mouse: React.MutableRefObject<{ x: number; y: number }>,
  staticity: number,
  ease: number,
  size: number,
  drawCircle: (context: CanvasRenderingContext2D, circle: Circle, update?: boolean) => void,
  dpr: number
) {
  // Generate data packets occasionally
  createDataPackets(circles.current);
  
  // Update data packet positions
  updateDataPackets(circles.current);
  
  // First render the connections between nodes
  renderNetworkConnections(context, circles.current, dpr);
  
  // Then animate each node
  circles.current.forEach((circle: Circle, i: number) => {
    // Edge detection logic
    const edge = [
      circle.x + circle.translateX - circle.size, 
      canvasSize.current.w - circle.x - circle.translateX - circle.size, 
      circle.y + circle.translateY - circle.size, 
      canvasSize.current.h - circle.y - circle.translateY - circle.size, 
    ];
    const closestEdge = edge.reduce((a, b) => Math.min(a, b));
    const remapClosestEdge = parseFloat(
      remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
    );
    
    // Fade in/out based on edge proximity
    if (remapClosestEdge > 1) {
      circle.alpha += 0.01; // Slower fade-in for network
      if (circle.alpha > circle.targetAlpha) {
        circle.alpha = circle.targetAlpha;
      }
    } else {
      circle.alpha = circle.targetAlpha * remapClosestEdge;
    }
    
    // Subtle movement
    circle.x += circle.dx;
    circle.y += circle.dy;
    
    // Response to mouse movement
    circle.translateX +=
      (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
      ease;
    circle.translateY +=
      (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
      ease;

    // Draw the node
    drawCircle(context, circle, true);

    // Replace nodes that go off-screen
    if (
      circle.x < -circle.size ||
      circle.x > canvasSize.current.w + circle.size ||
      circle.y < -circle.size ||
      circle.y > canvasSize.current.h + circle.size
    ) {
      circles.current.splice(i, 1);
      const newCircle = generateCircleParams(canvasSize.current, "network", size);
      drawCircle(context, newCircle);
      
      // Update connections when nodes change
      createNetworkConnections(circles.current);
    }
  });
}
