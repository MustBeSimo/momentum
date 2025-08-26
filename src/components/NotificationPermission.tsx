'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { requestNotificationPermission } from '@/lib/notifications';

export default function NotificationPermission() {
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check notification permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show permission request if not granted or denied
      if (Notification.permission === 'default') {
        // Delay showing the request to let the app load first
        const timer = setTimeout(() => setShow(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
    setShow(false);
    
    if (granted) {
      // Show a success notification
      new Notification('Notifications Enabled! 🎉', {
        body: 'You\'ll now receive momentum reminders and updates.',
        icon: '/icon-192x192.svg'
      });
    }
  };

  const handleDismiss = () => {
    setShow(false);
    // Don't show again for this session
    sessionStorage.setItem('notificationPermissionDismissed', 'true');
  };

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('notificationPermissionDismissed') === 'true') {
    return null;
  }

  // Don't show if permission is already granted or denied
  if (permission !== 'default' || !show) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50 animate-in slide-in-from-bottom-2">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Enable Notifications
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Get momentum reminders, streak celebrations, and personalized insights to keep your progress flowing.
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleRequestPermission}
              className="flex-1 bg-blue-600 text-white text-xs px-3 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
