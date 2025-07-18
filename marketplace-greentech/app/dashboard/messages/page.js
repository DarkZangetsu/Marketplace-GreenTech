/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';

// Hook de debouncing pour optimiser les performances
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Send, User, ArrowLeft, Package, Search, MoreVertical, Image as ImageIcon, Paperclip, Smile, RefreshCw } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CONVERSATION, GET_ME, MY_MESSAGES } from '@/lib/graphql/queries';
import { MARK_MESSAGE_AS_READ, SEND_MESSAGE } from '@/lib/graphql/mutations';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import Image from 'next/image';
import { StatusIndicator } from '@/app/components/messages/StatusIndicator';
import { formatDate, formatMessageDate, getFullName, getProfilePictureUrl, getFileUrl } from '@/app/components/messages/Helper';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { getAttachmentType } from '@/app/components/messages/AttachmentType';
import Lightbox from '@/app/components/messages/Lightbox';

// Composant qui utilise useSearchParams
function MessagesPageContent() {
  const searchParams = useSearchParams();
  const listingIdParam = searchParams.get('listing');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Gestion globale des erreurs de promesses
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      // Empêcher l'erreur de remonter
      event.preventDefault();
      // Log silencieux en production
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  // États pour les messages temps réel
  const [allMessages, setAllMessages] = useState([]);
  const [lastMessageUpdate, setLastMessageUpdate] = useState(Date.now());

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [lightbox, setLightbox] = useState({ open: false, url: '', type: '' });
  const [visibleMessages, setVisibleMessages] = useState(new Set());

  // GraphQL queries et mutations - Optimisées pour les performances
  const { data: userData } = useQuery(GET_ME, {
    fetchPolicy: 'cache-first' // Utiliser le cache en priorité
  });

  // Initialiser les queries d'abord pour avoir refetchMessages disponible
  const currentUser = userData?.me;

  const { data: messagesData, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useQuery(MY_MESSAGES, {
    fetchPolicy: 'cache-and-network', // Restauré pour permettre les mises à jour temps réel
    notifyOnNetworkStatusChange: false, // Éviter les re-renders inutiles
    pollInterval: 0 // Sera mis à jour dynamiquement
  });

  // Gestionnaire de nouveaux messages WebSocket amélioré (défini après refetchMessages)
  const handleNewMessage = useCallback((messageData) => {
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
      return;
    }

    // Vérifier que toutes les propriétés nécessaires sont présentes
    if (!message.sender || !message.receiver || !message.listing) {
      return;
    }

    setAllMessages(prev => {
      // Vérifier si le message existe déjà
      const messageExists = prev.some(msg => msg?.id === message.id);
      if (messageExists) {
        return prev;
      }

      const newMessages = [...prev, message];

      // Forcer la mise à jour des conversations
      setTimeout(() => {
        setLastMessageUpdate(Date.now());
      }, 0);

      return newMessages;
    });

    // Refetch optimisé - seulement pour les nouveaux messages reçus
    setTimeout(() => {
      refetchMessages();
    }, 2000); // Délai plus long pour éviter les requêtes trop fréquentes
  }, [refetchMessages, setLastMessageUpdate]);

  const { isConnected, connectionState } = useWebSocket(currentUser?.id, handleNewMessage);

  // Mettre à jour le polling interval dynamiquement
  useEffect(() => {
    // Cette approche ne fonctionne pas directement avec Apollo, nous utiliserons le polling manuel
  }, [isConnected]);

  const { data: conversationData, loading: conversationLoading, refetch: refetchConversation } = useQuery(GET_CONVERSATION, {
    variables: {
      userId: activeConversation?.otherUser?.id,
      listingId: activeConversation?.listing?.id
    },
    skip: !activeConversation?.otherUser?.id || !activeConversation?.listing?.id,
    fetchPolicy: 'cache-first', // Changé de cache-and-network à cache-first
    notifyOnNetworkStatusChange: false // Éviter les re-renders inutiles
  });

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
  onCompleted: (data) => {
    setNewMessage('');
    setSelectedFile(null);

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

      // Refetch optimisé - seulement après envoi de message pour synchroniser
      setTimeout(() => {
        refetchMessages();
      }, 1000); // Délai plus long pour éviter les requêtes trop fréquentes
    }
  },
  onError: (error) => {
    // Error logging removed for production security
  }
});

  const [markAsRead] = useMutation(MARK_MESSAGE_AS_READ, {
    onCompleted: () => {
      // Refetch supprimé - l'état local est mis à jour directement
    },
    onError: (error) => {
      // Error logging removed for production security
    }
  });

  // Composant pour observer la visibilité des messages
  const MessageVisibilityObserver = ({ messageId, children }) => {
    const messageRef = useRef(null);

    useEffect(() => {
      const messageElement = messageRef.current;
      if (!messageElement) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleMessages(prev => new Set([...prev, messageId]));
            } else {
              setVisibleMessages(prev => {
                const newSet = new Set(prev);
                newSet.delete(messageId);
                return newSet;
              });
            }
          });
        },
        {
          threshold: 0.5, // Message considéré comme visible quand 50% est visible
          rootMargin: '0px 0px -50px 0px' // Marge pour déclencher plus tôt
        }
      );

      observer.observe(messageElement);

      return () => {
        observer.unobserve(messageElement);
      };
    }, [messageId]);

    return <div ref={messageRef}>{children}</div>;
  };

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

      setOnlineUsers(prev => {
        const newOnlineUsers = new Set(prev);
        const userIdString = String(userId);
        if (status === 'online') {
          newOnlineUsers.add(userIdString);
        } else {
          newOnlineUsers.delete(userIdString);
        }
        return newOnlineUsers;
      });
    };

    const handleOnlineUsersList = (event) => {
      const { onlineUsers } = event.detail;
      setOnlineUsers(new Set(onlineUsers));
    };

    window.addEventListener('userStatusChange', handleUserStatusChange);
    window.addEventListener('onlineUsersList', handleOnlineUsersList);

    return () => {
      window.removeEventListener('userStatusChange', handleUserStatusChange);
      window.removeEventListener('onlineUsersList', handleOnlineUsersList);
    };
  }, []);



  // Synchroniser quand WebSocket se reconnecte
  useEffect(() => {
    if (isConnected) {
      // Rafraîchir les messages quand WebSocket se reconnecte
      setTimeout(() => {
        refetchMessages();
      }, 1000);
    }
  }, [isConnected, refetchMessages]);

  // Synchroniser les messages GraphQL avec l'état local - Optimisé
  useEffect(() => {
    if (messagesData?.myMessages) {
      setAllMessages(prevMessages => {
        const graphqlMessages = messagesData.myMessages.filter(msg => msg && msg.id);
        const existingMessageIds = new Set(prevMessages.map(msg => msg?.id).filter(Boolean));

        // Ajouter uniquement les nouveaux messages GraphQL
        const newGraphqlMessages = graphqlMessages.filter(msg => !existingMessageIds.has(msg.id));

        if (newGraphqlMessages.length > 0) {
          const mergedMessages = [...prevMessages, ...newGraphqlMessages];
          // Trier par date de création
          const sortedMessages = mergedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

          // Mise à jour immédiate sans setTimeout pour éviter les cascades
          setLastMessageUpdate(Date.now());

          return sortedMessages;
        }

        return prevMessages;
      });
    }
  }, [messagesData?.myMessages]);

  // Synchroniser les messages de conversation - Optimisé
  useEffect(() => {
    if (conversationData?.conversation) {
      const conversationMessages = conversationData.conversation.filter(msg => msg && msg.id);

      setAllMessages(prevMessages => {
        const existingIds = new Set(prevMessages.map(msg => msg?.id).filter(Boolean));
        const newMessages = conversationMessages.filter(msg => !existingIds.has(msg.id));

        if (newMessages.length > 0) {
          const mergedMessages = [...prevMessages, ...newMessages];
          return mergedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        return prevMessages;
      });

      // Scroll optimisé avec requestAnimationFrame
      requestAnimationFrame(() => scrollToBottom());
    }
  }, [conversationData?.conversation]);

  // Grouper les messages en conversations - Optimisé avec useMemo
  const conversations = useMemo(() => {
  if (!currentUser || !allMessages.length) {
    return [];
  }

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

  return sortedConversations;
}, [allMessages, currentUser, lastMessageUpdate]);

  // Fonction pour obtenir tous les utilisateurs en ligne (système réel WebSocket)
  const getAllOnlineUsers = useCallback(() => {
    return onlineUsers;
  }, [onlineUsers]);

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

      // Émettre un événement pour notifier les autres composants (comme la Navbar)
      window.dispatchEvent(new CustomEvent('messageMarkedAsRead', {
        detail: { messageId }
      }));

    } catch (error) {
      // Erreur silencieuse
    }
  };

  // Marquer plusieurs messages comme lus avec optimisation
  const handleMarkMultipleAsRead = useCallback(async (messageIds) => {
    if (!messageIds || messageIds.length === 0) {
      return;
    }

    // Mettre à jour l'état local immédiatement pour tous les messages
    setAllMessages(prev =>
      prev.map(msg =>
        messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
      )
    );

    // Déclencher la mise à jour des conversations
    setLastMessageUpdate(Date.now());

    // Marquer chaque message individuellement (en parallèle pour optimiser)
    const markPromises = messageIds.map(async (messageId) => {
      try {
        await markAsRead({
          variables: { messageId }
        });
      } catch (error) {
        // En cas d'erreur, remettre le message comme non lu dans l'état local
        setAllMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, isRead: false } : msg
          )
        );
      }
    });

    // Attendre que tous les marquages soient terminés
    await Promise.allSettled(markPromises);

    // Émettre un événement pour notifier les autres composants (comme la Navbar)
    window.dispatchEvent(new CustomEvent('multipleMessagesMarkedAsRead', {
      detail: { messageIds }
    }));
  }, [markAsRead]);

  // Marquer tous les messages non lus d'une conversation comme lus
  const markConversationAsRead = useCallback(async (conversation) => {
    if (!conversation || !currentUser || conversation.unreadCount === 0) {
      return;
    }

    // Récupérer tous les messages non lus de cette conversation
    const unreadMessages = allMessages.filter(message => {
      if (!message || !message.receiver || !message.sender || !message.listing) {
        return false;
      }

      return (
        message.receiver.id === currentUser.id &&
        !message.isRead &&
        message.sender.id === conversation.otherUser?.id &&
        message.listing.id === conversation.listing?.id
      );
    });

    if (unreadMessages.length > 0) {
      // Utiliser la fonction optimisée pour marquer plusieurs messages
      const messageIds = unreadMessages.map(msg => msg.id);
      await handleMarkMultipleAsRead(messageIds);
    }
  }, [allMessages, currentUser, handleMarkMultipleAsRead]);

  // Défiler vers le bas quand la conversation change et marquer les messages comme lus
  useEffect(() => {
    if (activeConversation) {
      const timer = setTimeout(scrollToBottom, 200);

      // Marquer automatiquement les messages non lus comme lus après un délai
      const markAsReadTimer = setTimeout(() => {
        markConversationAsRead(activeConversation);
      }, 500);

      return () => {
        clearTimeout(timer);
        clearTimeout(markAsReadTimer);
      };
    }
  }, [activeConversation, markConversationAsRead]);

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
        setActiveConversation(conversation);
        setShowMobileList(false);

        // Marquer les messages comme lus après un délai pour les conversations ouvertes via URL
        setTimeout(() => {
          markConversationAsRead(conversation);
        }, 800);
      }
    } else if (conversations.length > 0 && !activeConversation) {
      const firstConversation = conversations[0];
      setActiveConversation(firstConversation);

      // Marquer les messages comme lus pour la première conversation aussi
      setTimeout(() => {
        markConversationAsRead(firstConversation);
      }, 800);
    }
  }, [listingIdParam, conversations, activeConversation, markConversationAsRead]);

  // Envoyer un message
  const handleSendMessage = async (event) => {
    event.preventDefault();

    if ((!newMessage.trim() && !selectedFile) || !activeConversation || sendingMessage || !activeConversation.otherUser || !activeConversation.listing) return;

    try {
      const variables = {
        listingId: activeConversation.listing.id,
        message: newMessage,
        receiverId: activeConversation.otherUser.id
      };

      if (selectedFile) {
        variables.attachment = selectedFile;
        // Déterminer le type de fichier plus précisément
        if (selectedFile.type.startsWith('image/')) {
          variables.attachmentType = 'image';
        } else if (selectedFile.type.startsWith('video/')) {
          variables.attachmentType = 'video';
        } else if (selectedFile.type.startsWith('audio/')) {
          variables.attachmentType = 'audio';
        } else if (selectedFile.type === 'application/pdf') {
          variables.attachmentType = 'pdf';
        } else if (selectedFile.type.startsWith('text/')) {
          variables.attachmentType = 'text';
        } else {
          variables.attachmentType = 'file';
        }
      }

      await sendMessage({
        variables
      });

      setNewMessage('');
      setSelectedFile(null);
    } catch (error) {
      // Erreur silencieuse
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Marquer automatiquement les messages visibles comme lus après un délai
  const markVisibleMessagesAsRead = useCallback(() => {
    if (!activeConversation || !currentUser || visibleMessages.size === 0) {
      return;
    }

    const unreadVisibleMessages = Array.from(visibleMessages).filter(messageId => {
      const message = allMessages.find(msg => msg.id === messageId);
      return message &&
             message.receiver.id === currentUser.id &&
             !message.isRead &&
             message.sender.id === activeConversation.otherUser?.id;
    });

    if (unreadVisibleMessages.length > 0) {
      handleMarkMultipleAsRead(unreadVisibleMessages);
    }
  }, [activeConversation, currentUser, visibleMessages, allMessages, handleMarkMultipleAsRead]);

  // Effet pour marquer les messages visibles comme lus après un délai
  useEffect(() => {
    if (visibleMessages.size > 0) {
      const timer = setTimeout(() => {
        markVisibleMessagesAsRead();
      }, 2000); // Marquer comme lu après 2 secondes de visibilité

      return () => clearTimeout(timer);
    }
  }, [visibleMessages, markVisibleMessagesAsRead]);

  // Gérer le clic sur une conversation
  const handleConversationClick = async (conversation) => {
    if (!conversation || !conversation.otherUser) {
      return;
    }

    setActiveConversation(conversation);
    setShowMobileList(false);

    // Marquer les messages non lus comme lus après un court délai
    setTimeout(async () => {
      try {
        await markConversationAsRead(conversation);
      } catch (error) {
        // Erreur silencieuse
      }
    }, 300);
  };

  // Polling intelligent - seulement si WebSocket déconnecté
  useEffect(() => {
    let interval;

    // Polling de secours seulement si WebSocket n'est pas connecté
    if (!isConnected && !sendingMessage) {
      interval = setInterval(() => {
        refetchMessages();
      }, 10000); // Toutes les 10 secondes seulement si WebSocket down
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConnected, refetchMessages, sendingMessage]);

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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-green-600 mr-2 transition-colors duration-200 inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100"
              prefetch={true}
              replace={true}
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            {unreadCount > 0 && (
              <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => refetchMessages()}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Actualiser les messages"
            >
              <RefreshCw size={16} />
            </button>
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
                onChange={(event) => setSearchQuery(event.target.value)}
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
                                src={getProfilePictureUrl(conversation.otherUser.profilePicture)}
                                alt={getFullName(conversation.otherUser)}
                                className="w-full h-full object-cover"
                                width={48}
                                height={48}
                              />
                            ) : (
                              <User size={20} className="text-gray-500" />
                            )}
                          </div>
                          {/* Badge de statut en ligne */}
                          <div className="absolute -bottom-1 -right-1">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 border-white ${
                              getAllOnlineUsers()?.has?.(String(conversation.otherUser.id))
                                ? 'bg-green-500 animate-pulse'
                                : 'bg-gray-400'
                            }`} />
                          </div>
                        </div>
  
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex flex-col min-w-0 flex-1">
                              <h3 className="font-medium text-gray-900 truncate flex items-center">
                                {getFullName(conversation.otherUser)}
                                {conversation.unreadCount > 0 && (
                                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                                )}
                              </h3>
                              {/* <div className="flex items-center text-xs text-gray-500">
                                {(() => {
                                  const userId = String(conversation.otherUser.id);
                                  const allOnlineUsers = getAllOnlineUsers();
                                  const isOnline = allOnlineUsers?.has?.(userId);
                                  return (
                                    <>
                                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                        isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                                      }`} />
                                      {isOnline ? 'En ligne' : 'Hors ligne'}
                                    </>
                                  );
                                })()}
                              </div> */}
                            </div>
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
                            src={getProfilePictureUrl(activeConversation.otherUser.profilePicture)}
                            alt={getFullName(activeConversation.otherUser)}
                            className="w-full h-full object-cover"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <User size={18} className="text-gray-500" />
                        )}
                      </div>
                      {/* Badge de statut en ligne */}
                      {/* <div className="absolute -bottom-1 -right-1">
                        <div className={`w-3 h-3 rounded-full border-2 border-white ${
                          getAllOnlineUsers()?.has?.(String(activeConversation.otherUser.id))
                            ? 'bg-green-500 animate-pulse'
                            : 'bg-gray-400'
                        }`} />
                      </div> */}
                    </div>
  
                    <div>
                      <h3 className="font-medium text-gray-900">{getFullName(activeConversation.otherUser)}</h3>
                      {(() => {
                        const userId = String(activeConversation.otherUser.id);
                        const allOnlineUsers = getAllOnlineUsers();
                        const isOtherUserOnline = allOnlineUsers?.has?.(userId);
                        return (
                          <div className="flex items-center text-xs text-gray-500">
                            <div className={`w-2 h-2 rounded-full mr-2 ${isOtherUserOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                            {isOtherUserOnline ? 'En ligne' : 'Hors ligne'}
                          </div>
                        );
                      })()}
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
                  maxHeight: 'calc(100vh - 240px)' // Ajusté pour tenir compte du header
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
                      const type = message.attachment_type || getAttachmentType(message.attachment);
                      const url = message.attachment ? `http://localhost:8000/media/${message.attachment}` : null;
  
                      return (
                        <MessageVisibilityObserver key={message.id} messageId={message.id}>
                          <div>
                            {showDate && (
                              <div className="text-center py-2">
                                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                  {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[75%] sm:max-w-[60%] ${isFromMe ? 'order-2' : 'order-1'}`}>
                              {/* Affichage du fichier, SANS bulle colorée */}
                              {message.attachment && url && (
                                type === 'image' ? (
                                  <>
                                    <div className="relative w-full max-w-md mb-2 cursor-pointer" onClick={() => setLightbox({ open: true, url, type })}>
                                      <Image
                                        src={url}
                                        alt="Image attachée"
                                        width={400}
                                        height={300}
                                        className="rounded-lg object-cover"
                                        unoptimized
                                      />
                                    </div>
                                    <Lightbox open={lightbox.open && lightbox.url === url && lightbox.type === 'image'} onClose={() => setLightbox({ open: false, url: '', type: '' })} url={url} type="image" />
                                  </>
                                ) : type === 'video' ? (
                                  <>
                                    <div className="relative w-full max-w-md mb-2 cursor-pointer" onClick={() => setLightbox({ open: true, url, type })}>
                                      <video src={url} controls className="rounded-lg max-w-md bg-black" style={{ maxHeight: 300 }} />
                                    </div>
                                    <Lightbox open={lightbox.open && lightbox.url === url && lightbox.type === 'video'} onClose={() => setLightbox({ open: false, url: '', type: '' })} url={url} type="video" />
                                  </>
                                ) : type === 'audio' ? (
                                  <audio src={url} controls className="w-full mb-2" />
                                ) : type === 'pdf' ? (
                                  <a
                                    href={url}
                                    download
                                    className="text-sm text-blue-700 hover:underline flex items-center mb-2"
                                  >
                                    <Paperclip size={16} className="text-gray-500 mr-1" />
                                    {message.attachment.split('/').pop()}
                                  </a>
                                ) : (
                                  <a
                                    href={url}
                                    download
                                    className="text-sm text-blue-700 hover:underline flex items-center mb-2"
                                  >
                                    <Paperclip size={16} className="text-gray-500 mr-1" />
                                    {message.attachment.split('/').pop()}
                                  </a>
                                )
                              )}
                              {/* Bulle colorée UNIQUEMENT pour le texte/emoji */}
                              {message.message && (
                                <div
                                  className={`rounded-2xl px-4 py-2 ${isFromMe
                                    ? 'bg-green-500 text-white rounded-br-md'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                                  }`}
                                >
                                  <p className="text-sm break-words whitespace-pre-wrap">{message.message}</p>
                                </div>
                              )}
                              <p className={`text-xs mt-1 px-2 ${isFromMe ? 'text-right text-gray-500' : 'text-left text-gray-500'}`}>{formatMessageDate(message.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                        </MessageVisibilityObserver>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
  
              {/* Zone de saisie - Toujours visible si une conversation est active */}
              <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        placeholder="Écrivez votre message..."
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.target.value)}
                        disabled={sendingMessage}
                        rows={1}
                        style={{
                          minHeight: '44px',
                          maxHeight: '120px',
                          height: 'auto'
                        }}
                        onInput={(event) => {
                          event.target.style.height = 'auto';
                          event.target.style.height = event.target.scrollHeight + 'px';
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            handleSendMessage(event);
                          }
                        }}
                      />
                      {selectedFile && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 truncate">{selectedFile.name}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedFile(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-gray-500 hover:text-gray-700 p-2"
                    >
                      <Paperclip size={20} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="text-gray-500 hover:text-gray-700 p-2"
                    >
                      <Smile size={20} />
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                      disabled={sendingMessage || (!newMessage.trim() && !selectedFile)}
                    >
                      {sendingMessage ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                </form>
                {showEmojiPicker && (
                  <div className="absolute bottom-20 right-4">
                    <Picker
                      data={data}
                      onEmojiSelect={handleEmojiSelect}
                      theme="light"
                      set="native"
                      previewPosition="none"
                      skinTonePosition="none"
                    />
                  </div>
                )}
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

// Composant principal avec Suspense boundary
export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des messages...</p>
        </div>
      </div>
    }>
      <MessagesPageContent />
    </Suspense>
  );
}