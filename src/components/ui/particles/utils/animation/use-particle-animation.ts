
import { useCallback } from "react";
import { Circle, CanvasSize } from "../../types";
import { 
  initDefaultParticles, animateDefaultParticles,
  initJourneyParticles, animateJourneyParticles,
  initCableParticles, animateCableParticles,
  initNetworkParticles, animateNetworkParticles
} from "./index";
import { getParticleRenderer } from "../../renderers";

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
    switch (variant) {
      case "network":
        initNetworkParticles(context, quantity, canvasSize, drawCircle, circles, size);
        break;
      case "cable":
        initCableParticles(context, quantity, canvasSize, drawCircle, size, cablePaths);
        break;
      case "journey":
        initJourneyParticles(context, quantity, canvasSize, drawCircle, size);
        break;
      default:
        initDefaultParticles(context, quantity, canvasSize, drawCircle, size);
        break;
    }
  }, [canvasSize, drawCircle, size, variant, cablePaths, circles]);

  /**
   * Animates all particles
   */
  const animateParticles = useCallback((context: CanvasRenderingContext2D) => {
    switch (variant) {
      case "network":
        animateNetworkParticles(
          context, 
          circles, 
          canvasSize, 
          mouse, 
          staticity, 
          ease, 
          size, 
          drawCircle, 
          dpr
        );
        break;
      case "cable":
        animateCableParticles(
          context, 
          circles, 
          canvasSize, 
          drawCircle, 
          cablePaths
        );
        break;
      case "journey":
        animateJourneyParticles(
          context, 
          circles, 
          canvasSize, 
          mouse, 
          staticity, 
          ease, 
          size, 
          drawCircle
        );
        break;
      default:
        animateDefaultParticles(
          context, 
          circles, 
          canvasSize, 
          mouse, 
          staticity, 
          ease, 
          size, 
          vx, 
          vy, 
          drawCircle
        );
        break;
    }
  }, [canvasSize, circles, drawCircle, ease, mouse, size, staticity, variant, vx, vy, cablePaths, dpr]);

  return {
    drawCircle,
    initParticles,
    animateParticles
  };
}
