'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

// This component displays a message notification icon with unread count
export default function MessageNotification() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch unread messages count from the API
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/messages');
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
        // Set a default value in case of error
        setUnreadCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUnreadCount();
    
    // Poll for new messages every minute
    const interval = setInterval(fetchUnreadCount, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Link href="/messages" className="relative text-gray-700 hover:text-green-600">
      <MessageSquare size={20} />
      {!isLoading && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
} 