// Momentum calculation utilities for Upraze

import { Domain, Phase, TaskType } from '@/types';

// Constants
const EMA_ALPHA = 0.3; // Daily EMA smoothing factor
const STREAK_DECAY = 7; // Days for streak score decay
const MOMENTUM_WEIGHTS = {
  velocity: 0.5,
  acceleration: 0.2,
  z: 0.2,
  streak: 0.1,
};

// Preprocess data: resample → winsorize 1% tails → rolling z over 60d
export function preprocessData(values: number[]): number[] {
  if (values.length === 0) return [];
  
  // Sort and winsorize 1% tails
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const lowerIndex = Math.floor(n * 0.01);
  const upperIndex = Math.floor(n * 0.99);
  
  const winsorized = values.map(v => {
    if (v < sorted[lowerIndex]) return sorted[lowerIndex];
    if (v > sorted[upperIndex]) return sorted[upperIndex];
    return v;
  });
  
  // Calculate rolling z-score over 60 days (or available data)
  const window = Math.min(60, winsorized.length);
  const result: number[] = [];
  
  for (let i = 0; i < winsorized.length; i++) {
    const start = Math.max(0, i - window + 1);
    const windowData = winsorized.slice(start, i + 1);
    const mean = windowData.reduce((sum, val) => sum + val, 0) / windowData.length;
    const variance = windowData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / windowData.length;
    const std = Math.sqrt(variance);
    
    if (std === 0) {
      result.push(0);
    } else {
      result.push((winsorized[i] - mean) / std);
    }
  }
  
  return result;
}

// Calculate EMA: EMA_t = α*x_t + (1-α)*EMA_{t-1}
export function calculateEMA(values: number[], alpha: number = EMA_ALPHA): number[] {
  if (values.length === 0) return [];
  
  const ema: number[] = [values[0]];
  
  for (let i = 1; i < values.length; i++) {
    const newEMA = alpha * values[i] + (1 - alpha) * ema[i - 1];
    ema.push(newEMA);
  }
  
  return ema;
}

// Calculate velocity: velocity_t = EMA_t - EMA_{t-1}
export function calculateVelocity(ema: number[]): number[] {
  if (ema.length < 2) return [0];
  
  const velocity: number[] = [0];
  
  for (let i = 1; i < ema.length; i++) {
    velocity.push(ema[i] - ema[i - 1]);
  }
  
  return velocity;
}

// Calculate acceleration: accel_t = velocity_t - velocity_{t-1}
export function calculateAcceleration(velocity: number[]): number[] {
  if (velocity.length < 2) return [0];
  
  const acceleration: number[] = [0];
  
  for (let i = 1; i < velocity.length; i++) {
    acceleration.push(velocity[i] - velocity[i - 1]);
  }
  
  return acceleration;
}

// Calculate streak: streak_t = 1 + (streak_{t-1} if event_today else 0)
export function calculateStreak(events: boolean[]): number[] {
  const streak: number[] = [];
  let currentStreak = 0;
  
  for (const event of events) {
    if (event) {
      currentStreak++;
    } else {
      currentStreak = 0;
    }
    streak.push(currentStreak);
  }
  
  return streak;
}

// Calculate streak score: streak_score = 1 - exp(-streak_t/7)
export function calculateStreakScore(streak: number[]): number[] {
  return streak.map(s => 1 - Math.exp(-s / STREAK_DECAY));
}

// Calculate momentum score (0-100)
export function calculateMomentumScore(
  velocity: number,
  acceleration: number,
  z: number,
  streakScore: number,
  taskType: TaskType
): number {
  if (taskType === 'Milestone') {
    // Milestones are binary completion
    return velocity > 0 ? 100 : 0;
  }
  
  // For compounding/maintenance tasks
  const score = 
    MOMENTUM_WEIGHTS.velocity * velocity +
    MOMENTUM_WEIGHTS.acceleration * acceleration +
    MOMENTUM_WEIGHTS.z * z +
    MOMENTUM_WEIGHTS.streak * streakScore;
  
  // Normalize to 0-100 range
  return Math.max(0, Math.min(100, (score + 1) * 50));
}

// Detect phase based on EMA, velocity, and acceleration
export function detectPhase(
  ema: number,
  velocity: number,
  acceleration: number,
  streak: number
): { phase: Phase; confidence: number } {
  // Simple threshold-based phase detection
  // In production, this would use more sophisticated change-point detection
  
  const absVelocity = Math.abs(velocity);
  const absAccel = Math.abs(acceleration);
  
  if (absVelocity < 0.05 && absAccel < 0.02) {
    if (streak === 0) {
      return { phase: 'Archive', confidence: 0.8 };
    } else {
      return { phase: 'Drift', confidence: 0.7 };
    }
  }
  
  if (velocity > 0.1 && acceleration > 0.02) {
    return { phase: 'Ramp', confidence: 0.8 };
  }
  
  if (velocity > 0.05 && absAccel < 0.05) {
    return { phase: 'Cruise', confidence: 0.7 };
  }
  
  if (absVelocity < 0.1 && absAccel < 0.1) {
    return { phase: 'Explore', confidence: 0.6 };
  }
  
  return { phase: 'Explore', confidence: 0.5 };
}

// Get domain color for UI
export function getDomainColor(domain: Domain): string {
  const colors = {
    Health: '#10B981', // emerald
    Focus: '#3B82F6', // blue
    Output: '#F59E0B', // amber
    Learning: '#8B5CF6', // violet
    Mood: '#EC4899', // pink
  };
  
  return colors[domain];
}

// Get phase color for UI
export function getPhaseColor(phase: Phase): string {
  const colors = {
    Explore: '#6B7280', // gray
    Ramp: '#3B82F6', // blue
    Cruise: '#10B981', // green
    Drift: '#F59E0B', // amber
    Archive: '#EF4444', // red
  };
  
  return colors[phase];
}

// Format momentum score for display
export function formatMomentumScore(score: number): string {
  if (score >= 80) return '🚀';
  if (score >= 60) return '📈';
  if (score >= 40) return '➡️';
  if (score >= 20) return '📉';
  return '⏸️';
}
