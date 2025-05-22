/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Send, User, ArrowLeft, Package, Trash2, Archive } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CONVERSATION, GET_ME } from '@/lib/graphql/queries';
import { MARK_MESSAGE_AS_READ, SEND_MESSAGE } from '@/lib/graphql/mutations';
import { gql } from '@apollo/client';
import Image from 'next/image';

// Updated GraphQL query
const MY_MESSAGES = gql`
  query MyMessages {
    myMessages(isRead: null) {
      id
      message
      isRead
      createdAt
      sender {
        id
        username
        firstName
        lastName
        email
        phoneNumber
        profilePicture
        createdAt
        updatedAt
        sentMessages {
          id
          message
          isRead
          createdAt
        }
        receivedMessages {
          id
          message
          isRead
          createdAt
        }
      }
      listing {
        id
        title
        description
        condition
        quantity
        unit
        price
        isFree
        location
        address
        contactMethod
        phoneNumber
        email
        status
        createdAt
        updatedAt
        userId
      }
      receiver {
        id
        username
        firstName
        lastName
        email
        phoneNumber
        profilePicture
        createdAt
        updatedAt
      }
    }
  }
`;

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

// Helper function to get full name
const getFullName = (user) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username;
};

// Helper function to generate correct image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `http://localhost:8000/media/${imagePath}`;
};

// Helper function to group messages into conversations
const groupMessagesIntoConversations = (messages, currentUserId) => {
  const conversationMap = new Map();
  
  messages.forEach(message => {
    // Determine the other user (not the current user)
    const otherUser = message.sender.id === currentUserId ? message.receiver : message.sender;
    const listingId = message.listing.id;
    
    // Create a unique key for each conversation (other user + listing)
    const conversationKey = `${otherUser.id}-${listingId}`;
    
    if (!conversationMap.has(conversationKey)) {
      conversationMap.set(conversationKey, {
        id: conversationKey,
        otherUser,
        listing: message.listing,
        messages: [],
        lastMessage: message,
        unreadCount: 0
      });
    }
    
    const conversation = conversationMap.get(conversationKey);
    conversation.messages.push(message);
    
    // Update last message if this message is more recent
    if (new Date(message.createdAt) > new Date(conversation.lastMessage.createdAt)) {
      conversation.lastMessage = message;
    }
    
    // Count unread messages (messages received by current user that are unread)
    if (message.receiver.id === currentUserId && !message.isRead) {
      conversation.unreadCount++;
    }
  });
  
  // Convert map to array and sort by last message date
  return Array.from(conversationMap.values()).sort((a, b) => 
    new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
  );
};

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const listingIdParam = searchParams.get('listing');
  
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const [conversationMessages, setConversationMessages] = useState([]);

  // GraphQL queries and mutations
  const { data: userData } = useQuery(GET_ME);
  const { data: messagesData, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useQuery(MY_MESSAGES);
  
  const { data: conversationData, loading: conversationLoading, refetch: refetchConversation } = useQuery(GET_CONVERSATION, {
    variables: {
      userId: activeConversation?.otherUser?.id,
      listingId: activeConversation?.listing?.id
    },
    skip: !activeConversation?.otherUser?.id || !activeConversation?.listing?.id
  });

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setNewMessage('');
      refetchConversation();
      refetchMessages();
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    }
  });

  const [markAsRead] = useMutation(MARK_MESSAGE_AS_READ, {
    onCompleted: () => {
      refetchMessages();
    }
  });

  const currentUser = userData?.me;
  
  // Group messages into conversations - memoized to prevent infinite re-renders
  const conversations = useMemo(() => {
    if (!currentUser || !messagesData?.myMessages) return [];
    return groupMessagesIntoConversations(messagesData.myMessages, currentUser.id);
  }, [messagesData?.myMessages, currentUser?.id]);

  // Update conversation messages when conversation data changes
  useEffect(() => {
    if (conversationData?.conversation) {
      setConversationMessages(conversationData.conversation);
    } else if (activeConversation?.messages) {
      // Fallback to messages from the grouped conversation
      setConversationMessages(activeConversation.messages.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      ));
    }
  }, [conversationData, activeConversation]);

  // Handle URL parameter for specific listing
  useEffect(() => {
    if (listingIdParam && conversations.length > 0) {
      const conversation = conversations.find(c => c.listing.id === listingIdParam);
      if (conversation) {
        setActiveConversation(conversation);
        setShowMobileList(false);
      }
    } else if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [listingIdParam, conversations, activeConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation || sendingMessage) return;
    
    try {
      await sendMessage({
        variables: {
          listingId: activeConversation.listing.id,
          message: newMessage,
          receiverId: activeConversation.otherUser.id
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markAsRead({
        variables: { messageId }
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    setShowMobileList(false);
    
    // Mark unread messages as read
    if (conversation.unreadCount > 0) {
      conversation.messages.forEach(message => {
        if (message.receiver.id === currentUser?.id && !message.isRead) {
          handleMarkAsRead(message.id);
        }
      });
    }
  };

  const unreadCount = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);

  // Show loading state
  if (messagesLoading) {
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
  if (messagesError) {
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
              <p className="text-gray-600 mb-4">{messagesError.message}</p>
              <button 
                onClick={() => refetchMessages()}
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
                              {getFullName(conversation.otherUser)}
                              {conversation.unreadCount > 0 && (
                                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                              )}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessage && formatDate(conversation.lastMessage.createdAt)}
                            </span>
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {conversation.lastMessage.sender.id === currentUser?.id ? 'Vous: ' : ''}
                              {conversation.lastMessage.message}
                            </p>
                          )}
                          <div className="mt-2 flex items-center">
                            <Package size={14} className="text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{conversation.listing.title}</span>
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
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                        {activeConversation.otherUser.profilePicture ? (
                          <Image 
                            src={getImageUrl(activeConversation.otherUser.profilePicture)} 
                            alt={getFullName(activeConversation.otherUser)}
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <User size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{getFullName(activeConversation.otherUser)}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <Package size={12} className="mr-1" />
                          <Link href={`/listings/${activeConversation.listing.id}`} className="hover:text-green-600">
                            {activeConversation.listing.title}
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
                    {conversationLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-pulse flex space-x-4 items-center">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    ) : (
                      conversationMessages.map(message => {
                        const isFromMe = message.sender.id === currentUser?.id;
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                isFromMe 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p className={`text-xs mt-1 ${isFromMe ? 'text-green-100' : 'text-gray-500'}`}>
                                {formatDate(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
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
                        disabled={sendingMessage}
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 disabled:opacity-50"
                        disabled={sendingMessage || !newMessage.trim()}
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