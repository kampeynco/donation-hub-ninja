
// Re-export all operations from submodules
export { createCircleParams, drawCircle } from './operations/circle-operations';
export { drawConnections } from './operations/connection-operations';
export { animateParticles } from './operations/animation-operations';
export { drawParticles } from './operations/init-operations';

// Re-export the clearContext function to maintain backwards compatibility
export { clearContext } from './canvas-operations';
