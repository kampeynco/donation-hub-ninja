
import { useCallback } from "react";
import { Circle, CanvasSize } from "../types";
import { remapValue } from "../utils";
import { generateCircleParams } from "../circle-params";
import { getParticleRenderer } from "../renderers";

/**
 * Handles particle animation logic
 */
export function useParticleAnimation(
  variant: "default" | "journey",
  circles: React.MutableRefObject<Circle[]>,
  mouse: React.MutableRefObject<{ x: number; y: number }>,
  canvasSize: React.MutableRefObject<CanvasSize>,
  staticity: number,
  ease: number,
  size: number,
  vx: number,
  vy: number,
  dpr: number
) {
  const renderParticle = getParticleRenderer(variant);

  /**
   * Draws a circle on the canvas
   */
  const drawCircle = useCallback((
    context: CanvasRenderingContext2D,
    circle: Circle, 
    update = false
  ) => {
    renderParticle({
      context,
      circle,
      update,
      dpr
    });

    if (!update) {
      circles.current.push(circle);
    }
  }, [circles, dpr, renderParticle]);

  /**
   * Creates initial particles
   */
  const initParticles = useCallback((
    context: CanvasRenderingContext2D,
    quantity: number
  ) => {
    for (let i = 0; i < quantity; i++) {
      const circle = generateCircleParams(canvasSize.current, variant, size);
      drawCircle(context, circle);
    }
  }, [canvasSize, drawCircle, size, variant]);

  /**
   * Animates all particles
   */
  const animateParticles = useCallback((context: CanvasRenderingContext2D) => {
    circles.current.forEach((circle: Circle, i: number) => {
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
      
      if (variant === "journey") {
        circle.x += circle.dx;
        circle.y += circle.dy;
        
        circle.translateX +=
          (mouse.current.x / (staticity / (circle.magnetism * 0.5)) - circle.translateX) /
          ease;
        circle.translateY +=
          (mouse.current.y / (staticity / (circle.magnetism * 0.5)) - circle.translateY) /
          ease;
      } else {
        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX +=
          (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
          ease;
        circle.translateY +=
          (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
          ease;
      }

      drawCircle(context, circle, true);

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        if (variant === "journey" && circle.x > canvasSize.current.w + circle.size) {
          circle.x = -circle.size;
          circle.y = Math.random() * canvasSize.current.h;
        } else {
          circles.current.splice(i, 1);
          const newCircle = generateCircleParams(canvasSize.current, variant, size);
          drawCircle(context, newCircle);
        }
      }
    });
  }, [canvasSize, circles, drawCircle, ease, mouse, size, staticity, variant, vx, vy]);

  return {
    drawCircle,
    initParticles,
    animateParticles
  };
}
