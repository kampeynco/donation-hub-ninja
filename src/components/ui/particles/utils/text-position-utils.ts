
/**
 * Gets the position of specific characters in a text element
 * @param element The text element to analyze
 * @param targetChars Array of characters to find positions for
 * @returns Array of character position objects
 */
export function getCharacterPositions(element: HTMLElement | null, targetChars: string[]) {
  if (!element) return [];
  
  const positions = [];
  const text = element.textContent || '';
  
  // Create a range to measure positions
  const range = document.createRange();
  
  // Find all occurrences of target characters
  for (const char of targetChars) {
    let idx = 0;
    while ((idx = text.indexOf(char, idx)) !== -1) {
      try {
        // Set start of range to the character
        range.setStart(element.firstChild || element, idx);
        range.setEnd(element.firstChild || element, idx + 1);
        
        // Get the bounding rectangle
        const rect = range.getBoundingClientRect();
        
        // Add to positions array
        positions.push({
          char,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        });
        
        idx += 1;
      } catch (e) {
        console.error(`Error measuring character ${char} at index ${idx}:`, e);
        idx += 1;
      }
    }
  }
  
  return positions;
}

/**
 * Creates a bezier curve path between two points
 * @param startX Start X coordinate
 * @param startY Start Y coordinate
 * @param endX End X coordinate
 * @param endY End Y coordinate
 * @param curvature How curved the path should be (0-1)
 * @param canvasRect Canvas bounding rectangle for coordinate adjustment
 * @returns Path2D object and its approximate length
 */
export function createCurvePath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  curvature = 0.5,
  canvasRect?: DOMRect
) {
  // Adjust coordinates relative to canvas if a canvas rect is provided
  const adjustX = (x: number) => canvasRect ? x - canvasRect.left : x;
  const adjustY = (y: number) => canvasRect ? y - canvasRect.top : y;
  
  // Adjust input coordinates
  const x1 = adjustX(startX);
  const y1 = adjustY(startY);
  const x2 = adjustX(endX);
  const y2 = adjustY(endY);
  
  // Calculate control points for the bezier curve
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Control point offsets - different for each curve for variation
  const cpOffset = distance * curvature;
  
  // Create the path
  const path = new Path2D();
  path.moveTo(x1, y1);
  
  // Create bezier curve
  const cp1x = x1 + dx / 3;
  const cp1y = y1 + cpOffset;
  const cp2x = x1 + 2 * dx / 3;
  const cp2y = y2 - cpOffset;
  
  path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
  
  // Store points for animation (we'll use these for calculating positions)
  const points = approximateBezierPoints(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2);
  (path as any)._points = points;
  
  // Calculate approximate path length
  const pathLength = calculateApproximatePathLength(points);
  
  return {
    path,
    length: pathLength,
    points
  };
}

/**
 * Approximates points along a bezier curve for animation
 */
function approximateBezierPoints(
  x1: number, y1: number,
  cp1x: number, cp1y: number,
  cp2x: number, cp2y: number,
  x2: number, y2: number,
  steps = 100
) {
  const points = [];
  
  for (let t = 0; t <= 1; t += 1/steps) {
    // Cubic Bezier formula
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    
    const x = x1 * mt3 + 3 * cp1x * mt2 * t + 3 * cp2x * mt * t2 + x2 * t3;
    const y = y1 * mt3 + 3 * cp1y * mt2 * t + 3 * cp2y * mt * t2 + y2 * t3;
    
    points.push({ x, y });
  }
  
  return points;
}

/**
 * Calculates the approximate length of a path from its points
 */
function calculateApproximatePathLength(points: {x: number, y: number}[]) {
  let length = 0;
  
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i-1].x;
    const dy = points[i].y - points[i-1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  
  return length;
}
