/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Send, User, ArrowLeft, Package, Search, MoreVertical } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CONVERSATION, GET_ME, MY_MESSAGES } from '@/lib/graphql/queries';
import { MARK_MESSAGE_AS_READ, SEND_MESSAGE } from '@/lib/graphql/mutations';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

  if (diffMinutes < 1) return 'Maintenant';
  if (diffMinutes < 60) return `${diffMinutes}min`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const formatMessageDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const getFullName = (user) => {
  if (!user) return 'Utilisateur inconnu';
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username || 'Utilisateur';
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `http://localhost:8000/media/${imagePath}`;
};

const StatusIndicator = ({ isOnline, userId, onlineUsers }) => {
  const userOnline = (onlineUsers && onlineUsers.has && onlineUsers.has(userId)) || isOnline;
  
  return (
    <div className="relative">
      <div
        className={`w-3 h-3 rounded-full border-2 border-white ${userOnline ? 'bg-green-500' : 'bg-gray-400'}`}
      />
      {userOnline && (
        <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
      )}
    </div>
  );
};

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const listingIdParam = searchParams.get('listing');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  // États pour les messages temps réel
  const [allMessages, setAllMessages] = useState([]);
  const [lastMessageUpdate, setLastMessageUpdate] = useState(Date.now());

  // GraphQL queries et mutations
  const { data: userData } = useQuery(GET_ME);
  const { data: messagesData, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useQuery(MY_MESSAGES, {
    fetchPolicy: 'cache-and-network'
  });

  const { data: conversationData, loading: conversationLoading, refetch: refetchConversation } = useQuery(GET_CONVERSATION, {
    variables: {
      userId: activeConversation?.otherUser?.id,
      listingId: activeConversation?.listing?.id
    },
    skip: !activeConversation?.otherUser?.id || !activeConversation?.listing?.id,
    fetchPolicy: 'cache-and-network'
  });

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
  onCompleted: (data) => {
    console.log('Message envoyé avec succès:', data);
    setNewMessage('');
    
    // Ajouter le message envoyé immédiatement à l'état local
    if (data.sendMessage) {
      setAllMessages(prev => {
        const messageExists = prev.some(msg => msg?.id === data.sendMessage.id);
        if (!messageExists) {
          const newMessages = [...prev, data.sendMessage];
          
          // Déclencher immédiatement la mise à jour
          setLastMessageUpdate(Date.now());
          
          // Défiler vers le bas
          setTimeout(scrollToBottom, 50);
          
          return newMessages;
        }
        return prev;
      });
      
      // Rafraîchir les données après un court délai
      setTimeout(() => {
        refetchMessages();
      }, 200);
    }
  },
  onError: (error) => {
    console.error('Erreur lors de l\'envoi du message:', error);
  }
});

  const [markAsRead] = useMutation(MARK_MESSAGE_AS_READ, {
    onCompleted: () => {
      // Rafraîchir les données après marquage comme lu
      setTimeout(() => {
        refetchMessages();
      }, 200);
    },
    onError: (error) => {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  });

  const currentUser = userData?.me;

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Gestion du statut des utilisateurs en ligne
  useEffect(() => {
    const handleUserStatusChange = (event) => {
      const { userId, status } = event.detail;
      console.log('Statut utilisateur changé:', userId, status);
      
      setOnlineUsers(prev => {
        const newOnlineUsers = new Set(prev);
        if (status === 'online') {
          newOnlineUsers.add(userId);
        } else {
          newOnlineUsers.delete(userId);
        }
        return newOnlineUsers;
      });
    };

    window.addEventListener('userStatusChange', handleUserStatusChange);
    
    return () => {
      window.removeEventListener('userStatusChange', handleUserStatusChange);
    };
  }, []);

  // Gestionnaire de nouveaux messages WebSocket amélioré
  const handleNewMessage = useCallback((messageData) => {
  console.log('Nouveau message reçu via WebSocket:', messageData);

  // Extraction correcte du message selon la structure reçue
  let message = messageData;
  
  // Si c'est une mutation SendMessage, extraire le message
  if (messageData?.sendMessage) {
    message = messageData.sendMessage;
  }
  
  // Si c'est wrappé dans messageObj
  if (messageData?.messageObj) {
    message = messageData.messageObj;
  }

  if (!message || !message.id) {
    console.warn('Message invalide reçu:', messageData);
    return;
  }

  // Vérifier que toutes les propriétés nécessaires sont présentes
  if (!message.sender || !message.receiver || !message.listing) {
    console.warn('Message avec propriétés manquantes:', message);
    return;
  }

  setAllMessages(prev => {
    // Vérifier si le message existe déjà
    const messageExists = prev.some(msg => msg?.id === message.id);
    if (messageExists) {
      console.log('Message déjà existant, ignoré:', message.id);
      return prev;
    }

    console.log('Ajout du nouveau message à l\'état local');
    const newMessages = [...prev, message];
    
    // Forcer la mise à jour des conversations
    setTimeout(() => {
      setLastMessageUpdate(Date.now());
    }, 0);
    
    return newMessages;
  });

  // Gestion de l'affichage et marquage comme lu
  if (activeConversation && currentUser && message?.sender && message?.receiver && message?.listing) {
    const isRelevantToActiveConversation = 
      ((message.sender.id === activeConversation.otherUser?.id && message.receiver.id === currentUser.id) ||
       (message.sender.id === currentUser.id && message.receiver.id === activeConversation.otherUser?.id)) &&
      message.listing.id === activeConversation.listing?.id;

    if (isRelevantToActiveConversation) {
      // Défiler vers le bas pour les nouveaux messages
      setTimeout(scrollToBottom, 100);
      
      // Marquer comme lu si c'est un message reçu
      if (message.receiver.id === currentUser.id && message.sender.id === activeConversation.otherUser?.id) {
        setTimeout(() => {
          handleMarkAsRead(message.id);
        }, 1000);
      }
    }
  }

  // Forcer le rafraîchissement des conversations après ajout
  setTimeout(() => {
    refetchMessages();
  }, 500);
}, [activeConversation, currentUser, refetchMessages]);

  // Initialiser WebSocket
  const { isConnected, connectionState } = useWebSocket(currentUser?.id, handleNewMessage);

  // Synchroniser les messages GraphQL avec l'état local
  useEffect(() => {
  if (messagesData?.myMessages) {
    console.log('Synchronisation des messages GraphQL:', messagesData.myMessages.length);
    
    setAllMessages(prevMessages => {
      const graphqlMessages = messagesData.myMessages.filter(msg => msg && msg.id);
      const existingMessageIds = new Set(prevMessages.map(msg => msg?.id).filter(Boolean));
      
      // Ajouter uniquement les nouveaux messages GraphQL
      const newGraphqlMessages = graphqlMessages.filter(msg => !existingMessageIds.has(msg.id));
      
      if (newGraphqlMessages.length > 0) {
        console.log('Nouveaux messages GraphQL ajoutés:', newGraphqlMessages.length);
        const mergedMessages = [...prevMessages, ...newGraphqlMessages];
        
        // Trier par date de création
        const sortedMessages = mergedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        // Déclencher la mise à jour des conversations
        setTimeout(() => {
          setLastMessageUpdate(Date.now());
        }, 0);
        
        return sortedMessages;
      }
      
      return prevMessages;
    });
  }
}, [messagesData?.myMessages]);

  // Synchroniser les messages de conversation
  useEffect(() => {
    if (conversationData?.conversation) {
      console.log('Mise à jour des messages de conversation:', conversationData.conversation.length);
      
      const conversationMessages = conversationData.conversation.filter(msg => msg && msg.id);
      
      setAllMessages(prevMessages => {
        const mergedMessages = [...prevMessages];
        
        // Ajouter les messages de conversation qui ne sont pas déjà présents
        conversationMessages.forEach(convMsg => {
          if (convMsg && convMsg.id && !mergedMessages.some(msg => msg?.id === convMsg.id)) {
            mergedMessages.push(convMsg);
          }
        });
        
        return mergedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
      
      setTimeout(scrollToBottom, 100);
    }
  }, [conversationData?.conversation]);

  // Grouper les messages en conversations - Optimisé avec useMemo
  const conversations = useMemo(() => {
  if (!currentUser || !allMessages.length) {
    console.log('Pas de currentUser ou de messages pour grouper');
    return [];
  }

  console.log('Regroupement des conversations avec', allMessages.length, 'messages');
  
  const conversationMap = {};

  allMessages.forEach(message => {
    // Vérification robuste des propriétés du message
    if (!message || 
        !message.sender || 
        !message.receiver || 
        !message.listing || 
        !message.id ||
        !message.sender.id ||
        !message.receiver.id ||
        !message.listing.id) {
      console.warn('Message avec données manquantes ignoré:', message);
      return;
    }

    const otherUser = message.sender.id === currentUser.id ? message.receiver : message.sender;
    const listingId = message.listing.id;
    const conversationKey = `${otherUser.id}-${listingId}`;

    if (!conversationMap[conversationKey]) {
      conversationMap[conversationKey] = {
        id: conversationKey,
        otherUser,
        listing: message.listing,
        messages: [],
        lastMessage: message,
        unreadCount: 0
      };
    }

    const conversation = conversationMap[conversationKey];
    
    // Éviter les doublons dans les messages de conversation
    const messageExists = conversation.messages.some(msg => msg.id === message.id);
    if (!messageExists) {
      conversation.messages.push(message);
    }

    // Mettre à jour le dernier message
    if (new Date(message.createdAt) > new Date(conversation.lastMessage.createdAt)) {
      conversation.lastMessage = message;
    }

    // Compter les messages non lus
    if (message.receiver.id === currentUser.id && !message.isRead) {
      conversation.unreadCount++;
    }
  });

  const sortedConversations = Object.values(conversationMap).sort((a, b) =>
    new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
  );

  console.log('Conversations créées:', sortedConversations.length);
  return sortedConversations;
}, [allMessages, currentUser, lastMessageUpdate]);

  // Filtrer les conversations selon la recherche
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    return conversations.filter(conversation =>
      conversation?.otherUser && conversation?.listing && (
        getFullName(conversation.otherUser).toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [conversations, searchQuery]);

  // Messages de la conversation active
  const conversationMessages = useMemo(() => {
    if (!activeConversation || !currentUser || !activeConversation.otherUser || !activeConversation.listing) {
      return [];
    }

    const messages = allMessages.filter(message => {
      // Vérifier que le message a toutes les propriétés nécessaires
      if (!message || !message.sender || !message.receiver || !message.listing) {
        return false;
      }

      const isRelevantConversation = 
        ((message.sender.id === activeConversation.otherUser.id && message.receiver.id === currentUser.id) ||
         (message.sender.id === currentUser.id && message.receiver.id === activeConversation.otherUser.id)) &&
        message.listing.id === activeConversation.listing.id;
      
      return isRelevantConversation;
    });

    return messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [allMessages, activeConversation, currentUser]);

  // Défiler vers le bas quand la conversation change
  useEffect(() => {
    if (activeConversation) {
      const timer = setTimeout(scrollToBottom, 200);
      return () => clearTimeout(timer);
    }
  }, [activeConversation]);

  // Défiler vers le bas quand de nouveaux messages arrivent dans la conversation active
  useEffect(() => {
    if (conversationMessages.length > 0) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [conversationMessages.length]);

  // Gérer le paramètre URL pour listing spécifique
  useEffect(() => {
    if (listingIdParam && conversations.length > 0) {
      const conversation = conversations.find(c => c?.listing?.id === listingIdParam);
      if (conversation && (!activeConversation || activeConversation.id !== conversation.id)) {
        console.log('Activation de la conversation depuis URL:', conversation.id);
        setActiveConversation(conversation);
        setShowMobileList(false);
      }
    } else if (conversations.length > 0 && !activeConversation) {
      console.log('Activation de la première conversation');
      setActiveConversation(conversations[0]);
    }
  }, [listingIdParam, conversations, activeConversation]);

  // Envoyer un message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !activeConversation || sendingMessage || !activeConversation.otherUser || !activeConversation.listing) return;

    console.log('Envoi du message:', newMessage);

    try {
      await sendMessage({
        variables: {
          listingId: activeConversation.listing.id,
          message: newMessage,
          receiverId: activeConversation.otherUser.id
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  // Marquer un message comme lu
  const handleMarkAsRead = async (messageId) => {
  try {
    await markAsRead({
      variables: { messageId }
    });
    
    // Mettre à jour l'état local immédiatement
    setAllMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
    
    // Déclencher la mise à jour des conversations
    setLastMessageUpdate(Date.now());
    
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error);
  }
};

  // Gérer le clic sur une conversation
  const handleConversationClick = (conversation) => {
    if (!conversation || !conversation.otherUser) {
      console.warn('Tentative de clic sur une conversation invalide:', conversation);
      return;
    }

    console.log('Clic sur conversation:', conversation.id);
    setActiveConversation(conversation);
    setShowMobileList(false);

    // Marquer les messages non lus comme lus
    if (conversation.unreadCount > 0 && conversation.messages) {
      conversation.messages.forEach(message => {
        if (message && message.receiver && message.receiver.id === currentUser?.id && !message.isRead) {
          handleMarkAsRead(message.id);
        }
      });
    }
  };

  useEffect(() => {
    // Rafraîchir périodiquement les messages pour s'assurer de la synchronisation
    const interval = setInterval(() => {
      if (!sendingMessage) {
        refetchMessages();
      }
    }, 1000); // Toutes les 10 secondes

    return () => clearInterval(interval);
  }, [refetchMessages, sendingMessage]);

  // Calculer le nombre total de messages non lus
  const unreadCount = conversations.reduce((total, conv) => total + (conv?.unreadCount || 0), 0);

  // États de chargement et d'erreur
  if (messagesLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{messagesError.message}</p>
          <button
            onClick={() => refetchMessages()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-20 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            {unreadCount > 0 && (
              <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <StatusIndicator isOnline={isConnected} userId={currentUser?.id} onlineUsers={onlineUsers} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'En ligne' : connectionState === 'connecting' ? 'Connexion...' : 'Hors ligne'}
            </span>
          </div>
        </div>
      </div>

      {/* Interface principale */}
      <div className="flex-1 flex overflow-hidden">
        {/* Liste des conversations */}
        <div className={`${showMobileList ? 'block' : 'hidden'} md:block w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}>
          {/* Barre de recherche */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Liste scrollable des conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {searchQuery ? 'Aucun résultat' : 'Aucun message'}
                </h3>
                <p className="text-xs text-gray-500">
                  {searchQuery ? 'Essayez un autre terme de recherche' : 'Vous n\'avez pas encore de conversations'}
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredConversations.map(conversation => {
                  if (!conversation || !conversation.otherUser || !conversation.listing) {
                    return null;
                  }

                  return (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${activeConversation?.id === conversation.id ? 'bg-green-50 border border-green-200' : ''
                        }`}
                      onClick={() => handleConversationClick(conversation)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {conversation.otherUser.profilePicture ? (
                              <Image
                                src={getImageUrl(conversation.otherUser.profilePicture)}
                                alt={getFullName(conversation.otherUser)}
                                className="w-full h-full object-cover"
                                width={48}
                                height={48}
                              />
                            ) : (
                              <User size={20} className="text-gray-500" />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1">
                            <StatusIndicator 
                              isOnline={onlineUsers.has(conversation.otherUser.id)} 
                              userId={conversation.otherUser.id}
                              onlineUsers={onlineUsers}
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate flex items-center">
                              {getFullName(conversation.otherUser)}
                              {conversation.unreadCount > 0 && (
                                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                              )}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {conversation.lastMessage && formatDate(conversation.lastMessage.createdAt)}
                            </span>
                          </div>

                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage.sender?.id === currentUser?.id ? 'Vous: ' : ''}
                              {conversation.lastMessage.message}
                            </p>
                          )}

                          <div className="mt-1 flex items-center">
                            <Package size={12} className="text-gray-400 mr-1 flex-shrink-0" />
                            <span className="text-xs text-gray-500 truncate">{conversation.listing.title}</span>
                          </div>
                        </div>

                        {conversation.unreadCount > 0 && (
                          <div className="flex-shrink-0">
                            <span className="bg-green-500 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className={`${!showMobileList ? 'block' : 'hidden'} md:block flex-1 flex flex-col bg-white overflow-hidden`}>
          {activeConversation && activeConversation.otherUser && activeConversation.listing ? (
            <>
              {/* En-tête de conversation */}
              <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      className="md:hidden text-gray-500 hover:text-gray-700"
                      onClick={() => setShowMobileList(true)}
                    >
                      <ArrowLeft size={20} />
                    </button>

                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {activeConversation.otherUser.profilePicture ? (
                          <Image
                            src={getImageUrl(activeConversation.otherUser.profilePicture)}
                            alt={getFullName(activeConversation.otherUser)}
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <User size={18} className="text-gray-500" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        <StatusIndicator 
                          isOnline={onlineUsers.has(activeConversation.otherUser.id)} 
                          userId={activeConversation.otherUser.id}
                          onlineUsers={onlineUsers}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">{getFullName(activeConversation.otherUser)}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <div className={`w-2 h-2 rounded-full mr-2 ${onlineUsers.has(activeConversation.otherUser.id) ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {onlineUsers.has(activeConversation.otherUser.id) ? 'En ligne' : 'Hors ligne'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/listings/${activeConversation.listing.id}`}
                      className="text-sm text-green-600 hover:text-green-700 flex items-center space-x-1"
                    >
                      <Package size={14} />
                      <span className="hidden sm:inline">{activeConversation.listing.title}</span>
                    </Link>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Zone des messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-4 py-4"
                style={{
                  scrollBehavior: 'smooth',
                  maxHeight: 'calc(100vh - 200px)'
                }}
              >
                {conversationLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversationMessages.map((message, index) => {
                      const isFromMe = message.sender.id === currentUser?.id;
                      const showDate = index === 0 ||
                        new Date(conversationMessages[index - 1].createdAt).toDateString() !== new Date(message.createdAt).toDateString();

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center py-2">
                              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          )}

                          <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] sm:max-w-[60%] ${isFromMe ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`rounded-2xl px-4 py-2 ${isFromMe
                                    ? 'bg-green-500 text-white rounded-br-md'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                                  }`}
                              >
                                <p className="text-sm break-words whitespace-pre-wrap">{message.message}</p>
                              </div>
                              <p className={`text-xs mt-1 px-2 ${isFromMe ? 'text-right text-gray-500' : 'text-left text-gray-500'
                                }`}>
                                {formatMessageDate(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Zone de saisie */}
              <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      placeholder="Écrivez votre message..."
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sendingMessage}
                      rows={1}
                      style={{
                        minHeight: '44px',
                        maxHeight: '120px',
                        height: 'auto'
                      }}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    disabled={sendingMessage || !newMessage.trim()}
                  >
                    {sendingMessage ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
                <p className="text-gray-600 max-w-sm">
                  Choisissez une conversation dans la liste pour commencer à discuter.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}