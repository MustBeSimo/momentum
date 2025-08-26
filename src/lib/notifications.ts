import { UserConfig } from '@/components/Onboarding';
import { MomentumScore } from '@/types';

export interface Notification {
  id: string;
  type: 'momentum_alert' | 'streak_celebration' | 'goal_reminder' | 'loop_reminder' | 'daily_checkin' | 'insight';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  action?: string;
  actionUrl?: string;
  timestamp: Date;
  read: boolean;
  category: 'momentum' | 'goals' | 'loops' | 'insights';
}

export interface NotificationSettings {
  browserNotifications: boolean;
  dailyReminders: boolean;
  streakCelebrations: boolean;
  momentumAlerts: boolean;
  loopReminders: boolean;
  goalReminders: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
}

// Default notification settings
export const defaultNotificationSettings: NotificationSettings = {
  browserNotifications: true,
  dailyReminders: true,
  streakCelebrations: true,
  momentumAlerts: true,
  loopReminders: true,
  goalReminders: true,
  quietHours: {
    enabled: true,
    start: "22:00",
    end: "08:00"
  }
};

// Request browser notification permissions
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Send browser notification
export function sendBrowserNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192x192.svg',
      badge: '/icon-72x72.svg',
      ...options
    });
  }
}

// Generate momentum flow notifications
export function generateMomentumNotifications(
  userConfig: UserConfig,
  momentumData: MomentumScore[],
  lastCheckin?: Date
): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  // Daily check-in reminder
  if (!lastCheckin || isNewDay(lastCheckin, now)) {
    notifications.push({
      id: `daily-checkin-${now.toISOString()}`,
      type: 'daily_checkin',
      title: 'Time for your daily momentum check-in! 📊',
      message: `Track your progress across ${userConfig.focusAreas.length} focus areas and keep your momentum flowing.`,
      priority: 'high',
      action: 'Log Progress',
      actionUrl: '/dashboard',
      timestamp: now,
      read: false,
      category: 'momentum'
    });
  }

  // Momentum loop reminders
  if (userConfig.momentumLoops.career) {
    notifications.push({
      id: `loop-career-${now.toISOString()}`,
      type: 'loop_reminder',
      title: 'Career Loop Reminder 🎯',
      message: userConfig.momentumLoops.career,
      priority: 'medium',
      action: 'Track Progress',
      actionUrl: '/career',
      timestamp: now,
      read: false,
      category: 'loops'
    });
  }

  if (userConfig.momentumLoops.culture) {
    notifications.push({
      id: `loop-culture-${now.toISOString()}`,
      type: 'loop_reminder',
      title: 'Culture Loop Reminder 🌟',
      message: userConfig.momentumLoops.culture,
      priority: 'medium',
      action: 'Track Progress',
      actionUrl: '/dashboard',
      timestamp: now,
      read: false,
      category: 'loops'
    });
  }

  if (userConfig.momentumLoops.growth) {
    notifications.push({
      id: `loop-growth-${now.toISOString()}`,
      type: 'loop_reminder',
      title: 'Growth Loop Reminder 📈',
      message: userConfig.momentumLoops.growth,
      priority: 'medium',
      action: 'Track Progress',
      actionUrl: '/dashboard',
      timestamp: now,
      read: false,
      category: 'loops'
    });
  }

  // Streak celebrations
  momentumData.forEach(data => {
    if (data.streak >= 7 && data.streak % 7 === 0) {
      notifications.push({
        id: `streak-${data.domain}-${now.toISOString()}`,
        type: 'streak_celebration',
        title: `${data.streak} Day Streak! 🎉`,
        message: `Amazing! You've maintained ${data.domain} momentum for ${data.streak} days straight.`,
        priority: 'medium',
        action: 'View Details',
        actionUrl: '/dashboard',
        timestamp: now,
        read: false,
        category: 'momentum'
      });
    }
  });

  // Momentum alerts
  momentumData.forEach(data => {
    if (data.velocity < -0.1) {
      notifications.push({
        id: `alert-${data.domain}-${now.toISOString()}`,
        type: 'momentum_alert',
        title: `${data.domain} Momentum Alert ⚠️`,
        message: `Your ${data.domain.toLowerCase()} momentum is declining. Consider reviewing your approach.`,
        priority: 'high',
        action: 'Review Domain',
        actionUrl: '/dashboard',
        timestamp: now,
        read: false,
        category: 'momentum'
      });
    }
  });

  // Goal reminders
  if (userConfig.goals.shortTerm) {
    notifications.push({
      id: `goal-short-${now.toISOString()}`,
      type: 'goal_reminder',
      title: 'Short-term Goal Check-in 🎯',
      message: `How's your progress on: "${userConfig.goals.shortTerm}"?`,
      priority: 'medium',
      action: 'Update Progress',
      actionUrl: '/dashboard',
      timestamp: now,
      read: false,
      category: 'goals'
    });
  }

  // Phase-specific insights
  const phaseInsights = getPhaseInsights(userConfig.currentPhase);
  if (phaseInsights) {
    notifications.push({
      id: `insight-phase-${now.toISOString()}`,
      type: 'insight',
      title: 'Phase Insight 💡',
      message: phaseInsights,
      priority: 'low',
      action: 'Learn More',
      actionUrl: '/dashboard',
      timestamp: now,
      read: false,
      category: 'insights'
    });
  }

  return notifications;
}

// Generate energy anchor reminders
export function generateEnergyAnchorReminders(userConfig: UserConfig): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  // Physical energy anchors
  userConfig.energyAnchors.physical.forEach(anchor => {
    if (anchor.includes('sleep') || anchor.includes('exercise')) {
      notifications.push({
        id: `energy-${anchor}-${now.toISOString()}`,
        type: 'goal_reminder',
        title: 'Energy Anchor Reminder ⚡',
        message: `Time to focus on: ${anchor}`,
        priority: 'medium',
        action: 'Log Activity',
        actionUrl: '/dashboard',
        timestamp: now,
        read: false,
        category: 'goals'
      });
    }
  });

  return notifications;
}

// Get phase-specific insights
function getPhaseInsights(phase: string): string | null {
  const insights = {
    early: "You're in the exploration phase. Focus on trying new things and building foundational habits.",
    sustained: "You're in the mastery phase. Deepen your existing practices and optimize your systems.",
    transition: "You're between phases. Take time to reflect and plan your next momentum push."
  };
  return insights[phase as keyof typeof insights] || null;
}

// Check if it's a new day
function isNewDay(lastDate: Date, currentDate: Date): boolean {
  const last = new Date(lastDate);
  const current = new Date(currentDate);
  return last.getDate() !== current.getDate() || 
         last.getMonth() !== current.getMonth() || 
         last.getFullYear() !== current.getFullYear();
}

// Schedule notifications
export function scheduleNotifications(notifications: Notification[], settings: NotificationSettings) {
  if (!settings.browserNotifications) return;

  notifications.forEach(notification => {
    // Check quiet hours
    if (settings.quietHours.enabled && isInQuietHours(settings.quietHours)) {
      return;
    }

    // Schedule based on priority
    const delay = getNotificationDelay(notification.priority);
    
    setTimeout(() => {
      sendBrowserNotification(notification.title, {
        body: notification.message,
        tag: notification.id,
        requireInteraction: notification.priority === 'high',
        actions: notification.action ? [
          {
            action: 'open',
            title: notification.action
          }
        ] : undefined
      });
    }, delay);
  });
}

// Check if current time is in quiet hours
function isInQuietHours(quietHours: { start: string; end: string }): boolean {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = quietHours.start.split(':').map(Number);
  const [endHour, endMin] = quietHours.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;
  
  if (startTime <= endTime) {
    return currentTime >= startTime && currentTime <= endTime;
  } else {
    // Overnight quiet hours
    return currentTime >= startTime || currentTime <= endTime;
  }
}

// Get notification delay based on priority
function getNotificationDelay(priority: string): number {
  switch (priority) {
    case 'high':
      return 0; // Immediate
    case 'medium':
      return 5000; // 5 seconds
    case 'low':
      return 15000; // 15 seconds
    default:
      return 5000;
  }
}

// Notification storage
export class NotificationManager {
  private notifications: Notification[] = [];
  private settings: NotificationSettings = defaultNotificationSettings;

  constructor() {
    this.loadFromStorage();
  }

  addNotification(notification: Notification) {
    this.notifications.unshift(notification);
    this.saveToStorage();
    this.scheduleNotification(notification);
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveToStorage();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getNotifications(category?: string): Notification[] {
    if (category) {
      return this.notifications.filter(n => n.category === category);
    }
    return this.notifications;
  }

  updateSettings(settings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...settings };
    this.saveToStorage();
  }

  private scheduleNotification(notification: Notification) {
    if (this.settings.browserNotifications) {
      scheduleNotifications([notification], this.settings);
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = data.notifications || [];
        this.settings = data.settings || defaultNotificationSettings;
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('notifications', JSON.stringify({
        notifications: this.notifications,
        settings: this.settings
      }));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }
}

// Global notification manager instance
export const notificationManager = new NotificationManager();
