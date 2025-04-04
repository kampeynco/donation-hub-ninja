
export interface MousePosition {
  x: number;
  y: number;
}

export interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
  variant?: "default" | "journey";
}

export interface ParticleRendererProps {
  context: CanvasRenderingContext2D;
  circle: Circle;
  update?: boolean;
  dpr: number;
}

export type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
  color?: string;
  type?: string;
};

export interface CanvasSize {
  w: number;
  h: number;
}
