
import { useCallback, RefObject } from "react";
import { CanvasSize } from "../types";

/**
 * Canvas utility functions for managing canvas size and context
 */
export function useCanvasManagement(
  canvasRef: RefObject<HTMLCanvasElement>,
  canvasContainerRef: RefObject<HTMLDivElement>,
  canvasSize: React.MutableRefObject<CanvasSize>,
  dpr: number
) {
  /**
   * Clears the canvas context
   */
  const clearContext = useCallback((context: CanvasRenderingContext2D) => {
    context.clearRect(
      0,
      0,
      canvasSize.current.w,
      canvasSize.current.h,
    );
  }, [canvasSize]);

  /**
   * Resizes the canvas to match container size
   */
  const resizeCanvas = useCallback((context: CanvasRenderingContext2D | null) => {
    if (canvasContainerRef.current && canvasRef.current && context) {
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.scale(dpr, dpr);
    }
  }, [canvasRef, canvasContainerRef, canvasSize, dpr]);

  return {
    clearContext,
    resizeCanvas
  };
}
