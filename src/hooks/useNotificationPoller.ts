import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { useToast } from '../components/ui/Toast';

interface ApiPost {
  id: number;
  title: string;
  body: string;
}

export const useNotificationPoller = (intervalMs = 30000) => {
  const { addNotifications } = useNotificationStore();
  const { addToast } = useToast();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUpdates = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      if (!response.ok) return;

      const data: ApiPost[] = await response.json();
      
      const formatted = data.map((post) => ({
        id: `post-${post.id}`,
        title: post.title.slice(0, 30) + '...',
        body: post.body.slice(0, 60) + '...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));

      const added = addNotifications(formatted);

      // Toast alert for newly fetched items
      if (added.length > 0) {
        addToast(`📢 ${added.length} new sprint notification(s)`, 'info');
      }
    } catch {
      // Ignore network errors during background polling
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchUpdates();

    const startPolling = () => {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          if (document.visibilityState === 'visible') {
            fetchUpdates();
          }
        }, intervalMs);
      }
    };

    const stopPolling = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    // Page Visibility API handler
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUpdates(); // Refresh immediately when tab becomes active
        startPolling();
      } else {
        stopPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs]);
};