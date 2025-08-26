'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Notification, 
  notificationManager, 
  requestNotificationPermission,
  NotificationSettings 
} from '@/lib/notifications';

interface NotificationBellProps {
  onNotificationClick?: (notification: Notification) => void;
}

export default function NotificationBell({ onNotificationClick }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
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
  });

  useEffect(() => {
    loadNotifications();
    loadSettings();
    
    // Request notification permission on mount
    requestNotificationPermission();
    
    // Set up periodic refresh
    const interval = setInterval(loadNotifications, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    const allNotifications = notificationManager.getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(notificationManager.getUnreadCount());
  };

  const loadSettings = () => {
    // Load settings from localStorage or use defaults
    const stored = localStorage.getItem('notificationSettings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    notificationManager.markAsRead(notification.id);
    loadNotifications();
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    notificationManager.markAllAsRead();
    loadNotifications();
  };

  const handleDeleteNotification = (id: string) => {
    notificationManager.deleteNotification(id);
    loadNotifications();
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    notificationManager.updateSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'momentum_alert':
        return '⚠️';
      case 'streak_celebration':
        return '🎉';
      case 'goal_reminder':
        return '🎯';
      case 'loop_reminder':
        return '🔄';
      case 'daily_checkin':
        return '📊';
      case 'insight':
        return '💡';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'momentum_alert':
        return 'border-l-red-500 bg-red-50';
      case 'streak_celebration':
        return 'border-l-green-500 bg-green-50';
      case 'goal_reminder':
        return 'border-l-blue-500 bg-blue-50';
      case 'loop_reminder':
        return 'border-l-purple-500 bg-purple-50';
      case 'daily_checkin':
        return 'border-l-orange-500 bg-orange-50';
      case 'insight':
        return 'border-l-teal-500 bg-teal-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-3">Notification Settings</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.browserNotifications}
                    onChange={(e) => handleSettingChange('browserNotifications', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Browser notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.dailyReminders}
                    onChange={(e) => handleSettingChange('dailyReminders', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Daily reminders</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.streakCelebrations}
                    onChange={(e) => handleSettingChange('streakCelebrations', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Streak celebrations</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.momentumAlerts}
                    onChange={(e) => handleSettingChange('momentumAlerts', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Momentum alerts</span>
                </label>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <>
                {unreadCount > 0 && (
                  <div className="p-3 border-b border-gray-200 bg-blue-50">
                    <button
                      onClick={handleMarkAllRead}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
                
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-l-4 hover:bg-gray-50 transition-colors cursor-pointer",
                        getNotificationColor(notification.type),
                        notification.read && "opacity-75"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <h4 className={cn(
                              "text-sm font-medium",
                              notification.read ? "text-gray-600" : "text-gray-900"
                            )}>
                              {notification.title}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.action && (
                              <span className="text-xs text-blue-600 font-medium">
                                {notification.action} →
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
