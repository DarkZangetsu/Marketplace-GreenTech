'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Send, User, ArrowLeft, Package, Trash2, Archive } from 'lucide-react';

// Helper to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Aujourd'hui à ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (diffDays === 1) {
    return `Hier à ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (diffDays < 7) {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return `${days[date.getDay()]} à ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
};

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const listingIdParam = searchParams.get('listing');
  
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/messages');
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        setConversations(data.conversations);
        
        // If a listing ID is provided in the URL, find and set the corresponding conversation
        if (listingIdParam) {
          const conversation = data.conversations.find(c => c.listingId === parseInt(listingIdParam));
          if (conversation) {
            setActiveConversation(conversation);
            setShowMobileList(false);
            // Mark as read
            markAsRead(conversation.id);
          }
        } else if (data.conversations.length > 0) {
          setActiveConversation(data.conversations[0]);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Impossible de charger les messages. Veuillez réessayer plus tard.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, [listingIdParam]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const messageData = {
      conversationId: activeConversation.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    // Optimistically update UI
    const updatedMessage = {
      id: Date.now(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sentByMe: true,
    };
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, updatedMessage],
          lastMessage: {
            content: newMessage,
            timestamp: new Date().toISOString(),
            isRead: true,
            sentByMe: true,
          }
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setActiveConversation(updatedConversations.find(c => c.id === activeConversation.id));
    setNewMessage('');
    
    // Send to API
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      // Could show an error toast here
    }
  };

  const markAsRead = async (conversationId) => {
    // Optimistically update UI
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === conversationId && !conv.lastMessage.isRead) {
          return {
            ...conv,
            lastMessage: {
              ...conv.lastMessage,
              isRead: true
            }
          };
        }
        return conv;
      })
    );
    
    // Update the server
    try {
      const response = await fetch(`/api/messages/${conversationId}/read`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
      // Could show an error toast here
    }
  };

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    markAsRead(conversation.id);
    setShowMobileList(false);
  };

  const unreadCount = conversations.filter(c => !c.lastMessage.isRead && !c.lastMessage.sentByMe).length;

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Chargement des conversations...</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-8">
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-pulse flex space-x-4 items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos conversations avec les acheteurs et vendeurs
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-8">
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main component
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos conversations avec les acheteurs et vendeurs
          </p>
        </div>
        
        {/* Messages interface */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversation list - hidden on mobile when a conversation is active */}
            <div className={`${showMobileList ? 'block' : 'hidden'} md:block w-full md:w-1/3 border-r border-gray-200`}>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <div className="overflow-y-auto h-[calc(600px-64px)]">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <MessageSquare className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Aucun message</h3>
                    <p className="text-xs text-gray-500">
                      Vous n'avez pas encore de conversations.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {conversations.map(conversation => (
                      <li 
                        key={conversation.id}
                        className={`hover:bg-gray-50 cursor-pointer ${activeConversation?.id === conversation.id ? 'bg-green-50' : ''}`}
                        onClick={() => handleConversationClick(conversation)}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-gray-900 flex items-center">
                              {conversation.otherUser.name}
                              {!conversation.lastMessage.isRead && !conversation.lastMessage.sentByMe && (
                                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                              )}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatDate(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {conversation.lastMessage.sentByMe ? 'Vous: ' : ''}{conversation.lastMessage.content}
                          </p>
                          <div className="mt-2 flex items-center">
                            <Package size={14} className="text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{conversation.listingTitle}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Conversation detail */}
            <div className={`${!showMobileList ? 'block' : 'hidden'} md:block w-full md:w-2/3 flex flex-col`}>
              {activeConversation ? (
                <>
                  {/* Conversation header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <button 
                        className="md:hidden mr-2 text-gray-500"
                        onClick={() => setShowMobileList(true)}
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{activeConversation.otherUser.name}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <Package size={12} className="mr-1" />
                          <Link href={`/listings/${activeConversation.listingId}`} className="hover:text-green-600">
                            {activeConversation.listingTitle}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600" title="Archiver la conversation">
                        <Archive size={18} />
                      </button>
                      <button className="text-gray-400 hover:text-red-600" title="Supprimer la conversation">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeConversation.messages.map(message => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sentByMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sentByMe 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.sentByMe ? 'text-green-100' : 'text-gray-500'}`}>
                            {formatDate(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSendMessage} className="flex items-center">
                      <input
                        type="text"
                        placeholder="Écrivez votre message..."
                        className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700"
                      >
                        <Send size={18} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation sélectionnée</h3>
                    <p className="text-gray-600">
                      Sélectionnez une conversation dans la liste pour afficher les messages.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 