import { useCallback, useEffect, useRef, useState } from "react";
import { createCablePaths } from "./utils/cable";

export function useCablePaths(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  canvasSize: React.MutableRefObject<{ w: number; h: number }>,
  textIds: string[] = ["hero-title"],
  startChar: string = "D",
  endChar: string = "p",
  numLeftCables: number = 4
) {
  const [paths, setPaths] = useState<any[]>([]);
  const pathsCreated = useRef(false);
  
  const createPaths = useCallback(() => {
    if (!canvasRef.current || pathsCreated.current) return;
    
    // Small delay to ensure text elements are rendered and positioned
    setTimeout(() => {
      const newPaths = createCablePaths(
        canvasRef,
        textIds,
        startChar,
        endChar,
        numLeftCables,
        canvasSize.current
      );
      
      if (newPaths.length > 0) {
        setPaths(newPaths);
        pathsCreated.current = true;
      }
    }, 500);
  }, [canvasRef, canvasSize, textIds, startChar, endChar, numLeftCables]);
  
  // Create paths on mount and when canvas size changes
  useEffect(() => {
    createPaths();
    
    // Reset flag when canvas size changes to recreate paths
    const handleResize = () => {
      pathsCreated.current = false;
      createPaths();
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [createPaths]);
  
  return paths;
}
