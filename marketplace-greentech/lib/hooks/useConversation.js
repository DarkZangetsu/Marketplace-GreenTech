"use client"

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CONVERSATION, GET_MY_CONVERSATIONS } from '../graphql/queries';
import { MARK_MESSAGE_AS_READ, SEND_MESSAGE } from '../graphql/mutations';



export const useConversation = (listingId = null) => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  // Fetch all conversations
  const { 
    data: conversationsData, 
    loading: conversationsLoading, 
    error: conversationsError,
    refetch: refetchConversations 
  } = useQuery(GET_MY_CONVERSATIONS);

  // Fetch specific conversation messages
  const { 
    data: conversationData, 
    loading: messagesLoading,
    refetch: refetchMessages 
  } = useQuery(GET_CONVERSATION, {
    variables: {
      userId: activeConversation?.otherUser?.id,
      listingId: activeConversation?.listing?.id
    },
    skip: !activeConversation?.otherUser?.id || !activeConversation?.listing?.id,
    onCompleted: (data) => {
      if (data?.conversation) {
        setMessages(data.conversation);
      }
    }
  });

  // Send message mutation
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      refetchMessages();
      refetchConversations();
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    }
  });

  // Mark message as read mutation
  const [markAsReadMutation] = useMutation(MARK_MESSAGE_AS_READ, {
    onCompleted: () => {
      refetchConversations();
    }
  });

  // Memoize conversations to prevent unnecessary re-renders
  const conversations = useMemo(() => {
    return conversationsData?.myConversations || [];
  }, [conversationsData?.myConversations]);

  // Auto-select conversation based on listingId
  useEffect(() => {
    if (listingId && conversations.length > 0) {
      const conversation = conversations.find(c => c.listing.id === listingId);
      if (conversation) {
        setActiveConversation(conversation);
      }
    } else if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [listingId, conversations, activeConversation]);

  const sendMessage = async (messageContent, receiverId, listingId) => {
    if (!messageContent.trim()) return;

    try {
      await sendMessageMutation({
        variables: {
          message: messageContent.trim(),
          receiverId,
          listingId
        }
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await markAsReadMutation({
        variables: { messageId }
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    
    // Mark unread messages as read
    if (conversation.unreadCount > 0) {
      // You might need to implement a mutation to mark all conversation messages as read
      refetchConversations();
    }
  };

  const unreadCount = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);

  return {
    // Data
    conversations,
    activeConversation,
    messages,
    unreadCount,
    
    // Loading states
    conversationsLoading,
    messagesLoading,
    sendingMessage,
    
    // Errors
    conversationsError,
    
    // Actions
    sendMessage,
    markAsRead,
    selectConversation,
    setActiveConversation,
    refetchConversations,
    refetchMessages
  };
};