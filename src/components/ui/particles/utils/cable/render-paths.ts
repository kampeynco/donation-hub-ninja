
/**
 * Renders cable paths to the canvas
 */
export function renderCablePaths(
  context: CanvasRenderingContext2D,
  paths: { path: Path2D; color: string; width: number }[]
) {
  context.save();
  
  // Render each cable path
  paths.forEach(({ path, color, width }) => {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.globalAlpha = 0.3;  // Make cables semi-transparent
    context.stroke(path);
  });
  
  context.restore();
}
