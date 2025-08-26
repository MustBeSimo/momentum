import { Task, Domain, TaskType, MomentumScore } from '@/types';

// AI-powered task classification
export interface TaskClassification {
  domain: Domain;
  taskType: TaskType;
  confidence: number;
  reasoning: string;
  estimatedHours?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export async function classifyTask(taskText: string): Promise<TaskClassification> {
  // In a real implementation, this would call an AI API like OpenAI
  // For now, we'll use a rule-based system that mimics AI behavior
  
  const text = taskText.toLowerCase();
  
  // Domain classification logic
  let domain: Domain = 'Output';
  let domainReasoning = '';
  
  if (text.includes('sleep') || text.includes('exercise') || text.includes('meditation') || text.includes('health')) {
    domain = 'Health';
    domainReasoning = 'Contains health-related keywords';
  } else if (text.includes('focus') || text.includes('deep work') || text.includes('concentration') || text.includes('distraction')) {
    domain = 'Focus';
    domainReasoning = 'Contains focus-related keywords';
  } else if (text.includes('learn') || text.includes('study') || text.includes('course') || text.includes('skill')) {
    domain = 'Learning';
    domainReasoning = 'Contains learning-related keywords';
  } else if (text.includes('mood') || text.includes('happiness') || text.includes('gratitude') || text.includes('social')) {
    domain = 'Mood';
    domainReasoning = 'Contains mood-related keywords';
  } else {
    domainReasoning = 'Default to Output domain for productivity tasks';
  }
  
  // Task type classification
  let taskType: TaskType = 'Compounding';
  let typeReasoning = '';
  
  if (text.includes('daily') || text.includes('every day') || text.includes('routine')) {
    taskType = 'Cyclical';
    typeReasoning = 'Contains daily/routine keywords';
  } else if (text.includes('goal') || text.includes('target') || text.includes('milestone')) {
    taskType = 'Milestone';
    typeReasoning = 'Contains goal/milestone keywords';
  } else if (text.includes('maintain') || text.includes('keep') || text.includes('sustain')) {
    taskType = 'Maintenance';
    typeReasoning = 'Contains maintenance keywords';
  } else if (text.includes('explore') || text.includes('try') || text.includes('experiment')) {
    taskType = 'Exploration';
    typeReasoning = 'Contains exploration keywords';
  } else {
    typeReasoning = 'Default to Compounding for long-term growth tasks';
  }
  
  // Estimate difficulty and time
  const wordCount = taskText.split(' ').length;
  let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
  let estimatedHours = 1;
  
  if (wordCount < 5) {
    difficulty = 'Easy';
    estimatedHours = 0.5;
  } else if (wordCount > 15) {
    difficulty = 'Hard';
    estimatedHours = 3;
  }
  
  return {
    domain,
    taskType,
    confidence: 0.85,
    reasoning: `${domainReasoning}. ${typeReasoning}`,
    estimatedHours,
    difficulty
  };
}

// AI-powered momentum analysis
export interface MomentumInsight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

export function analyzeMomentum(momentumData: MomentumScore[]): MomentumInsight[] {
  const insights: MomentumInsight[] = [];
  
  // Find the highest and lowest performing domains
  const sortedByVelocity = [...momentumData].sort((a, b) => b.velocity - a.velocity);
  const topPerformer = sortedByVelocity[0];
  const bottomPerformer = sortedByVelocity[sortedByVelocity.length - 1];
  
  // Positive insights
  if (topPerformer.velocity > 0.1) {
    insights.push({
      type: 'positive',
      title: `${topPerformer.domain} is on fire! 🔥`,
      description: `Your ${topPerformer.domain.toLowerCase()} momentum is strong with a ${topPerformer.velocity.toFixed(2)} velocity. Keep this energy going!`,
      action: 'Consider increasing focus on this domain',
      priority: 'medium'
    });
  }
  
  // Negative insights
  if (bottomPerformer.velocity < -0.05) {
    insights.push({
      type: 'negative',
      title: `${bottomPerformer.domain} needs attention ⚠️`,
      description: `Your ${bottomPerformer.domain.toLowerCase()} momentum is declining (${bottomPerformer.velocity.toFixed(2)} velocity).`,
      action: 'Review what might be causing this decline',
      priority: 'high'
    });
  }
  
  // Streak insights
  const longStreaks = momentumData.filter(d => d.streak >= 7);
  if (longStreaks.length > 0) {
    insights.push({
      type: 'positive',
      title: 'Impressive streaks! 🎯',
      description: `${longStreaks.length} domain${longStreaks.length > 1 ? 's' : ''} with 7+ day streaks. Consistency is key!`,
      priority: 'low'
    });
  }
  
  return insights;
}

// AI-powered weekly review generation
export interface WeeklyReviewInsight {
  summary: string;
  highlights: string[];
  challenges: string[];
  recommendations: string[];
  nextWeekGoals: string[];
}

export function generateWeeklyReview(
  momentumData: MomentumScore[],
  tasks: Task[],
  weekNumber: number
): WeeklyReviewInsight {
  const insights = analyzeMomentum(momentumData);
  
  const summary = `Week ${weekNumber} showed ${insights.filter(i => i.type === 'positive').length} positive trends and ${insights.filter(i => i.type === 'negative').length} areas needing attention.`;
  
  const highlights = insights
    .filter(i => i.type === 'positive')
    .map(i => i.title);
  
  const challenges = insights
    .filter(i => i.type === 'negative')
    .map(i => i.title);
  
  const recommendations = insights
    .filter(i => i.action)
    .map(i => i.action!);
  
  // Generate next week goals based on current performance
  const nextWeekGoals = momentumData
    .filter(d => d.velocity < 0)
    .map(d => `Improve ${d.domain.toLowerCase()} momentum`)
    .slice(0, 3);
  
  return {
    summary,
    highlights,
    challenges,
    recommendations,
    nextWeekGoals
  };
}

// Smart notification system
export interface SmartNotification {
  id: string;
  type: 'momentum_alert' | 'streak_celebration' | 'goal_reminder' | 'insight';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  action?: string;
}

export function generateSmartNotifications(
  momentumData: MomentumScore[],
  tasks: Task[]
): SmartNotification[] {
  const notifications: SmartNotification[] = [];
  
  // Momentum alerts
  momentumData.forEach(data => {
    if (data.velocity < -0.1) {
      notifications.push({
        id: `momentum-${data.domain}`,
        type: 'momentum_alert',
        title: `${data.domain} Momentum Alert`,
        message: `Your ${data.domain.toLowerCase()} momentum is declining. Consider reviewing your approach.`,
        priority: 'high',
        action: 'Review domain'
      });
    }
  });
  
  // Streak celebrations
  momentumData.forEach(data => {
    if (data.streak >= 7 && data.streak % 7 === 0) {
      notifications.push({
        id: `streak-${data.domain}`,
        type: 'streak_celebration',
        title: `${data.streak} Day Streak! 🎉`,
        message: `Amazing! You've maintained ${data.domain} for ${data.streak} days straight.`,
        priority: 'medium'
      });
    }
  });
  
  return notifications;
}
