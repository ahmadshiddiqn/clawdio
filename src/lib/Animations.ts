export type AnimationState = 'idle' | 'bored' | 'surprised' | 'happy' | 'excited' | 'sleepy';

export interface AnimationConfig {
  scaleBase: number;
  scaleAmplitude: number;
  scaleSpeed: number;
  rotationSpeed: number;
  eyeOpenness: number;
  bodyColor: string;
}

export const ANIMATION_CONFIGS: Record<AnimationState, AnimationConfig> = {
  idle: {
    scaleBase: 1.0,
    scaleAmplitude: 0.03,
    scaleSpeed: 0.02,
    rotationSpeed: 0.001,
    eyeOpenness: 1.0,
    bodyColor: '#D4A373'
  },
  bored: {
    scaleBase: 1.0,
    scaleAmplitude: 0.02,
    scaleSpeed: 0.015,
    rotationSpeed: 0.005,
    eyeOpenness: 0.6,
    bodyColor: '#C9956C'
  },
  surprised: {
    scaleBase: 1.2,
    scaleAmplitude: 0.08,
    scaleSpeed: 0.08,
    rotationSpeed: 0.02,
    eyeOpenness: 1.4,
    bodyColor: '#E8B87D'
  },
  happy: {
    scaleBase: 1.08,
    scaleAmplitude: 0.05,
    scaleSpeed: 0.05,
    rotationSpeed: 0.01,
    eyeOpenness: 1.2,
    bodyColor: '#D4A373'
  },
  excited: {
    scaleBase: 1.15,
    scaleAmplitude: 0.08,
    scaleSpeed: 0.1,
    rotationSpeed: 0.03,
    eyeOpenness: 1.3,
    bodyColor: '#E8A85C'
  },
  sleepy: {
    scaleBase: 0.95,
    scaleAmplitude: 0.01,
    scaleSpeed: 0.01,
    rotationSpeed: 0.0005,
    eyeOpenness: 0.3,
    bodyColor: '#C49060'
  }
};
