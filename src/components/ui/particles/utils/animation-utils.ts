
import { useCallback } from "react";
import { Circle, CanvasSize } from "../types";
import { remapValue } from "../utils";
import { 
  generateCircleParams, 
  createNetworkConnections, 
  createDataPackets, 
  updateDataPackets 
} from "../circle-params";
import { getParticleRenderer, renderNetworkConnections } from "../renderers";
import { updateCableParticles, renderCablePaths } from "./cable-utils";

/**
 * Handles particle animation logic
 */
export function useParticleAnimation(
  variant: "default" | "journey" | "cable" | "network",
  circles: React.MutableRefObject<Circle[]>,
  mouse: React.MutableRefObject<{ x: number; y: number }>,
  canvasSize: React.MutableRefObject<CanvasSize>,
  staticity: number,
  ease: number,
  size: number,
  vx: number,
  vy: number,
  dpr: number,
  cablePaths?: { path: Path2D; length: number; points: { x: number; y: number }[]; color: string; width: number }[]
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
    if (variant === "network") {
      // Create network nodes
      for (let i = 0; i < quantity; i++) {
        const circle = generateCircleParams(canvasSize.current, variant, size);
        drawCircle(context, circle);
      }
      
      // Create connections between nodes
      createNetworkConnections(circles.current);
    } else if (variant === "cable" && cablePaths && cablePaths.length > 0) {
      // If we're using cable variant, draw the cable paths first
      if (variant === "cable" && cablePaths && cablePaths.length > 0) {
        renderCablePaths(context, cablePaths);
        
        // Create particles that follow the paths
        for (let i = 0; i < quantity; i++) {
          const circle = generateCircleParams(canvasSize.current, variant, size, cablePaths);
          drawCircle(context, circle);
        }
      }
    } else {
      // Use default behavior for other variants
      for (let i = 0; i < quantity; i++) {
        const circle = generateCircleParams(canvasSize.current, variant, size);
        drawCircle(context, circle);
      }
    }
  }, [canvasSize, drawCircle, size, variant, cablePaths, circles]);

  /**
   * Animates all particles
   */
  const animateParticles = useCallback((context: CanvasRenderingContext2D) => {
    if (variant === "network") {
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
          const newCircle = generateCircleParams(canvasSize.current, variant, size);
          drawCircle(context, newCircle);
          
          // Update connections when nodes change
          createNetworkConnections(circles.current);
        }
      });
    } else if (variant === "cable" && cablePaths && cablePaths.length > 0) {
      // If cable variant, draw the cable paths on each frame
      if (variant === "cable" && cablePaths && cablePaths.length > 0) {
        // Clear context
        context.globalAlpha = 1;
        
        // Draw the cable paths
        renderCablePaths(context, cablePaths);
        
        // Update cable particles
        updateCableParticles(circles.current);
        
        // Draw the particles
        circles.current.forEach((circle, i) => {
          drawCircle(context, circle, true);
          
          // If particle completed its journey, reset it
          if (circle.pathProgress && circle.pathProgress >= 1) {
            circles.current.splice(i, 1);
            const newCircle = generateCircleParams(canvasSize.current, "cable", size, cablePaths);
            drawCircle(context, newCircle);
          }
        });
      }
    } else if (variant === "journey") {
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
            const newCircle = generateCircleParams(canvasSize.current, variant, size);
            drawCircle(context, newCircle);
          }
        }
      });
    } else {
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
        
        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX +=
          (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
          ease;
        circle.translateY +=
          (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
          ease;

        drawCircle(context, circle, true);

        if (
          circle.x < -circle.size ||
          circle.x > canvasSize.current.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSize.current.h + circle.size
        ) {
          circles.current.splice(i, 1);
          const newCircle = generateCircleParams(canvasSize.current, variant, size);
          drawCircle(context, newCircle);
        }
      });
    }
  }, [canvasSize, circles, drawCircle, ease, mouse, size, staticity, variant, vx, vy, cablePaths, dpr]);

  return {
    drawCircle,
    initParticles,
    animateParticles
  };
}
