
import { useCallback, RefObject } from "react";
import { MousePosition } from "../types";

/**
 * Mouse position tracking utilities for particles animation
 */
export function useMouseTracking(
  canvasRef: RefObject<HTMLCanvasElement>,
  mouse: React.MutableRefObject<{ x: number; y: number }>,
  canvasSize: React.MutableRefObject<{ w: number; h: number }>,
  mousePosition: MousePosition
) {
  /**
   * Updates mouse coordinates relative to canvas
   */
  const trackMousePosition = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  }, [canvasRef, canvasSize, mouse, mousePosition.x, mousePosition.y]);

  return {
    trackMousePosition
  };
}
