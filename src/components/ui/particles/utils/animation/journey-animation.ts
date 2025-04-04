
import { generateCircleParams } from "../../circle-params";
import { remapValue } from "../../utils";
import { CanvasSize, Circle } from "../../types";

/**
 * Initializes journey particles
 */
export function initJourneyParticles(
  context: CanvasRenderingContext2D,
  quantity: number,
  canvasSize: React.MutableRefObject<CanvasSize>,
  drawCircle: (context: CanvasRenderingContext2D, circle: Circle, update?: boolean) => void,
  size: number
) {
  for (let i = 0; i < quantity; i++) {
    const circle = generateCircleParams(canvasSize.current, "journey", size);
    drawCircle(context, circle);
  }
}

/**
 * Animates journey particles
 */
export function animateJourneyParticles(
  context: CanvasRenderingContext2D,
  circles: React.MutableRefObject<Circle[]>,
  canvasSize: React.MutableRefObject<CanvasSize>,
  mouse: React.MutableRefObject<{ x: number; y: number }>,
  staticity: number,
  ease: number,
  size: number,
  drawCircle: (context: CanvasRenderingContext2D, circle: Circle, update?: boolean) => void
) {
  circles.current.forEach((circle: Circle, i: number) => {
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
    if (remapClosestEdge > 1) {
      circle.alpha += 0.02;
      if (circle.alpha > circle.targetAlpha) {
        circle.alpha = circle.targetAlpha;
      }
    } else {
      circle.alpha = circle.targetAlpha * remapClosestEdge;
    }
    
    circle.x += circle.dx;
    circle.y += circle.dy;
    
    circle.translateX +=
      (mouse.current.x / (staticity / (circle.magnetism * 0.5)) - circle.translateX) /
      ease;
    circle.translateY +=
      (mouse.current.y / (staticity / (circle.magnetism * 0.5)) - circle.translateY) /
      ease;

    drawCircle(context, circle, true);

    if (
      circle.x < -circle.size ||
      circle.x > canvasSize.current.w + circle.size ||
      circle.y < -circle.size ||
      circle.y > canvasSize.current.h + circle.size
    ) {
      if (circle.x > canvasSize.current.w + circle.size) {
        circle.x = -circle.size;
        circle.y = Math.random() * canvasSize.current.h;
      } else {
        circles.current.splice(i, 1);
        const newCircle = generateCircleParams(canvasSize.current, "journey", size);
        drawCircle(context, newCircle);
      }
    }
  });
}
