// Core types for Upraze - Momentum of Me app

export type TaskType = 'Compounding' | 'Milestone' | 'Maintenance' | 'Cyclical' | 'Exploration';
export type Phase = 'Explore' | 'Ramp' | 'Cruise' | 'Drift' | 'Archive';
export type Domain = 'Health' | 'Focus' | 'Output' | 'Learning' | 'Mood';
export type NudgeType = 'Spark' | 'Signal' | 'Facilitator';

export interface User {
  id: string;
  email: string;
  timeZone: string;
  createdAt: Date;
}

export interface DomainConfig {
  id: string;
  userId: string;
  name: Domain;
  target: number;
  visibility: 'public' | 'private';
}

export interface Task {
  id: string;
  userId: string;
  text: string;
  domainId: string;
  taskType: TaskType;
  dueAt?: Date;
  archivedAt?: Date;
  createdAt: Date;
}

export interface Event {
  id: string;
  userId: string;
  domainId: string;
  taskId?: string;
  timestamp: Date;
  metric: string;
  value: number;
  source: string;
}

export interface Features {
  userId: string;
  domainId: string;
  timestamp: Date;
  ema: number;
  velocity: number;
  acceleration: number;
  z: number;
  streak: number;
}

export interface PhaseData {
  userId: string;
  domainId: string;
  timestamp: Date;
  phase: Phase;
  confidence: number;
}

export interface Forecast {
  userId: string;
  domainId: string;
  timestamp: Date;
  yhat: number;
  yhatLower: number;
  yhatUpper: number;
  horizonDays: number;
}

export interface Connector {
  id: string;
  userId: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  scopes: string[];
  createdAt: Date;
}

export interface Settings {
  userId: string;
  weights: {
    velocity: number;
    acceleration: number;
    z: number;
    streak: number;
  };
  privacyMode: 'local' | 'cloud';
}

export interface MomentumScore {
  domain: Domain;
  ema: number;
  velocity: number;
  acceleration: number;
  streak: number;
  momentumScore: number;
  phase: Phase;
}

export interface CareerFunnel {
  stage: 'Outreach' | 'Replies' | 'Interviews' | 'Offers';
  count: number;
  velocity: number;
  conversionToNext: number;
}

export interface WeeklyReview {
  week: string;
  domains: {
    name: Domain;
    ema: number;
    velocity: number;
    acceleration: number;
    streak: number;
    highlights?: string[];
    issues?: string[];
  }[];
  career?: {
    outreach: number;
    replies: number;
    interviews: number;
  };
  topDrivers: string[];
  goalsNextWeek: string[];
}

export interface Nudge {
  type: NudgeType;
  message: string;
  action?: string;
  phase: Phase;
  domain?: Domain;
}

export interface DailyProgressData {
  date: string;
  domainScores: Record<Domain, number>;
  notes: string;
  mood: number;
  energy: number;
  focus: number;
}
