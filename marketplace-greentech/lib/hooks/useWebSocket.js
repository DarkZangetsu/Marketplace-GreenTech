/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useCallback, useState } from 'react';

export const useWebSocket = (userId, onMessage) => {
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const pingIntervalRef = useRef(null);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const lastPongRef = useRef(Date.now());
  const pongTimeoutRef = useRef(null);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  };

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    if (pongTimeoutRef.current) {
      clearTimeout(pongTimeoutRef.current);
      pongTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!userId || !mountedRef.current) {
      return;
    }

    // Nettoyer les anciens timeouts/intervals
    cleanup();

    // Ne pas reconnecter si déjà en cours de connexion ou connecté
    if (ws.current && (ws.current.readyState === WebSocket.CONNECTING || ws.current.readyState === WebSocket.OPEN)) {
      return;
    }

    // Fermer l'ancienne connexion si elle existe
    if (ws.current) {
      ws.current.onopen = null;
      ws.current.onmessage = null;
      ws.current.onclose = null;
      ws.current.onerror = null;
      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.close(1000, 'Nouvelle connexion');
      }
      ws.current = null;
    }

    try {
      setConnectionState('connecting');
      setError(null);
      
      const token = getAuthToken();
      const baseWsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://marketplace-greentech.onrender.com';
      let wsUrl = `${baseWsUrl}/ws/messages/${userId}/`;
      
      if (token) {
        wsUrl += `?token=${encodeURIComponent(token)}`;
      }

      ws.current = new WebSocket(wsUrl);

      // Timeout de connexion
      const connectionTimeout = setTimeout(() => {
        if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
          ws.current.close();
          setError('Timeout de connexion');
          setConnectionState('error');
        }
      }, 10000); // 10 secondes timeout

      ws.current.onopen = (event) => {
        clearTimeout(connectionTimeout);
        if (!mountedRef.current) return;

        setConnectionState('connected');
        setError(null);
        reconnectAttemptsRef.current = 0;
        lastPongRef.current = Date.now();
        
        // Démarrer le ping avec un délai initial
        setTimeout(() => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN && mountedRef.current) {
            // Ping toutes les 30 secondes
            pingIntervalRef.current = setInterval(() => {
              if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                try {
                  ws.current.send(JSON.stringify({ type: 'ping' }));

                  // Timeout pour vérifier si on reçoit un pong
                  pongTimeoutRef.current = setTimeout(() => {
                    const timeSinceLastPong = Date.now() - lastPongRef.current;
                    if (timeSinceLastPong > 45000) { // 45 secondes sans pong
                      if (ws.current) {
                        ws.current.close(1006, 'Pas de pong reçu');
                      }
                    }
                  }, 15000); // Attendre 15 secondes pour le pong

                } catch (err) {
                  // Erreur silencieuse
                }
              }
            }, 30000);
            
            // Envoyer un ping initial et demander la liste des utilisateurs en ligne
            try {
              ws.current.send(JSON.stringify({ type: 'ping' }));
              // Demander la liste des utilisateurs en ligne
              setTimeout(() => {
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                  ws.current.send(JSON.stringify({ type: 'get_online_users' }));
                }
              }, 1000);
            } catch (err) {
              // Erreur silencieuse
            }
          }
        }, 1000);
      };

      ws.current.onmessage = (event) => {
        if (!mountedRef.current) return;
        
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'pong') {
            lastPongRef.current = Date.now();
            if (pongTimeoutRef.current) {
              clearTimeout(pongTimeoutRef.current);
              pongTimeoutRef.current = null;
            }
            return;
          }

          if (data.type === 'new_message' && onMessage) {
            onMessage(data.message);
          }

          // Gestion des notifications de statut utilisateur
          if (data.type === 'user_status' && data.user_id && data.status) {
            // Vous pouvez émettre un événement personnalisé ou utiliser un callback
            window.dispatchEvent(new CustomEvent('userStatusChange', {
              detail: { userId: data.user_id, status: data.status }
            }));
          }

          // Gestion de la liste des utilisateurs en ligne
          if (data.type === 'online_users_list' && data.online_users) {
            window.dispatchEvent(new CustomEvent('onlineUsersList', {
              detail: { onlineUsers: data.online_users, count: data.count }
            }));
          }

        } catch (error) {
          setError(`Erreur de parsing: ${error.message}`);
        }
      };

      ws.current.onclose = (event) => {
        clearTimeout(connectionTimeout);
        cleanup();
        
        if (!mountedRef.current) return;
        
        setConnectionState('disconnected');

        // Codes d'erreur spécifiques
        if (event.code === 4001) {
          setError('Authentification échouée');
          return;
        }

        if (event.code === 4000) {
          setError('Erreur de connexion du serveur');
        }

        // Si la fermeture est propre, ne pas reconnecter
        if (event.code === 1000 || event.code === 1001) {
          setError(null);
          return;
        }

        // Tentative de reconnexion pour les autres erreurs
        if (reconnectAttemptsRef.current < maxReconnectAttempts && event.code !== 4001 && mountedRef.current) {
          const delay = Math.min(Math.pow(2, reconnectAttemptsRef.current) * 1000, 30000);
          
          console.log(`Planification de reconnexion dans ${delay}ms (tentative ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              reconnectAttemptsRef.current++;
              console.log(`Tentative de reconnexion ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
              setConnectionState('reconnecting');
              connect();
            }
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Nombre maximum de tentatives de reconnexion atteint');
          setConnectionState('error');
        }
      };

      ws.current.onerror = (error) => {
        clearTimeout(connectionTimeout);
        
        if (!mountedRef.current) return;
        
        console.error('Erreur WebSocket:', error);
        console.error('WebSocket readyState:', ws.current?.readyState);
        
        // Gérer l'erreur selon l'état de la connexion
        if (ws.current?.readyState === WebSocket.CONNECTING) {
          console.error('Erreur lors de la connexion WebSocket');
          setError('Impossible de se connecter au serveur');
          setConnectionState('error');
        }
      };

    } catch (error) {
      console.error('Erreur lors de la création de la connexion WebSocket:', error);
      setError(`Erreur de création: ${error.message}`);
      setConnectionState('error');
    }
  }, [userId, onMessage, cleanup]);

  const disconnect = useCallback(() => {
    console.log('Déconnexion WebSocket demandée');
    mountedRef.current = false;
    
    cleanup();
    
    if (ws.current) {
      // Empêcher la reconnexion automatique
      reconnectAttemptsRef.current = maxReconnectAttempts;
      
      // Nettoyer les event handlers
      ws.current.onopen = null;
      ws.current.onmessage = null;
      ws.current.onclose = null;
      ws.current.onerror = null;
      
      // Fermer proprement
      if (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING) {
        ws.current.close(1000, 'Déconnexion demandée');
      }
      ws.current = null;
    }
    
    setConnectionState('disconnected');
    setError(null);
  }, [cleanup]);

  const forceReconnect = useCallback(() => {
    console.log('Reconnexion forcée demandée');
    reconnectAttemptsRef.current = 0;
    mountedRef.current = true;
    
    // Déconnecter proprement
    if (ws.current) {
      ws.current.onopen = null;
      ws.current.onmessage = null;
      ws.current.onclose = null;
      ws.current.onerror = null;
      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.close(1000, 'Reconnexion forcée');
      }
      ws.current = null;
    }
    
    cleanup();
    
    // Reconnecter après un délai
    setTimeout(() => {
      if (mountedRef.current) {
        connect();
      }
    }, 1000);
  }, [connect, cleanup]);

  // Effet principal
  useEffect(() => {
    mountedRef.current = true;
    
    if (userId) {
      connect();
    }
    
    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [userId]); // Seulement userId pour éviter les reconnexions inutiles

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanup();
      if (ws.current) {
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onclose = null;
        ws.current.onerror = null;
        if (ws.current.readyState === WebSocket.OPEN) {
          ws.current.close(1000, 'Composant démonté');
        }
        ws.current = null;
      }
    };
  }, [cleanup]);

  return {
    isConnected: connectionState === 'connected',
    connectionState,
    error,
    reconnect: forceReconnect,
    disconnect
  };
};