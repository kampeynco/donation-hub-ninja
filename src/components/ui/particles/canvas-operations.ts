
import { CanvasRefs, Circle } from "./types";

/**
 * Resizes the canvas based on its container size
 */
export function resizeCanvas(refs: CanvasRefs) {
  const { canvasContainerRef, canvasRef, context, circles, canvasSize } = refs;
  
  if (canvasContainerRef.current && canvasRef.current && context.current) {
    circles.current.length = 0;
    canvasSize.current.w = canvasContainerRef.current.offsetWidth;
    canvasSize.current.h = canvasContainerRef.current.offsetHeight;
    
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    canvasRef.current.width = canvasSize.current.w * dpr;
    canvasRef.current.height = canvasSize.current.h * dpr;
    canvasRef.current.style.width = `${canvasSize.current.w}px`;
    canvasRef.current.style.height = `${canvasSize.current.h}px`;
    context.current.scale(dpr, dpr);
  }
}

/**
 * Clears the canvas context
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

/**
 * Updates mouse position relative to canvas
 */
export function updateMousePosition(
  mousePosition: { x: number; y: number },
  refs: CanvasRefs
) {
  const { canvasRef, canvasSize, mouse } = refs;
  
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
}
