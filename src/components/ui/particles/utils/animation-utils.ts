
// Re-export all animation-related utilities from the new modular structure
// This maintains backward compatibility while allowing direct imports from the new files

export { 
  useParticleAnimation,
  initDefaultParticles, 
  animateDefaultParticles,
  initJourneyParticles, 
  animateJourneyParticles,
  initCableParticles, 
  animateCableParticles,
  initNetworkParticles, 
  animateNetworkParticles
} from './animation';
