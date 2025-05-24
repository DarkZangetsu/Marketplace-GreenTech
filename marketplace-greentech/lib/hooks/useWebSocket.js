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
  }, []);

  const connect = useCallback(() => {
    if (!userId || !mountedRef.current) {
      console.warn('UserID manquant ou composant démonté');
      return;
    }

    // Nettoyer les anciens timeouts/intervals
    cleanup();

    // Ne pas reconnecter si déjà en cours de connexion ou connecté
    if (ws.current && (ws.current.readyState === WebSocket.CONNECTING || ws.current.readyState === WebSocket.OPEN)) {
      console.log('WebSocket déjà connecté ou en cours de connexion');
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
      let wsUrl = `ws://localhost:8000/ws/messages/${userId}/`;
      
      if (token) {
        wsUrl += `?token=${encodeURIComponent(token)}`;
      }

      console.log('Tentative de connexion WebSocket:', wsUrl);
      ws.current = new WebSocket(wsUrl);

      // Timeout de connexion
      const connectionTimeout = setTimeout(() => {
        if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
          console.error('Timeout de connexion WebSocket');
          ws.current.close();
          setError('Timeout de connexion');
          setConnectionState('error');
        }
      }, 10000); // 10 secondes timeout

      ws.current.onopen = (event) => {
        clearTimeout(connectionTimeout);
        if (!mountedRef.current) return;
        
        console.log('✅ WebSocket connecté avec succès', event);
        setConnectionState('connected');
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        // Démarrer le ping avec un délai initial
        setTimeout(() => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN && mountedRef.current) {
            pingIntervalRef.current = setInterval(() => {
              if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                try {
                  ws.current.send(JSON.stringify({ type: 'ping' }));
                  console.log('Ping envoyé');
                } catch (err) {
                  console.error('Erreur lors de l\'envoi du ping:', err);
                }
              }
            }, 30000);
            
            // Envoyer un ping initial
            try {
              ws.current.send(JSON.stringify({ type: 'ping' }));
            } catch (err) {
              console.error('Erreur ping initial:', err);
            }
          }
        }, 1000);
      };

      ws.current.onmessage = (event) => {
        if (!mountedRef.current) return;
        
        try {
          const data = JSON.parse(event.data);
          console.log('Message WebSocket reçu:', data);
          
          if (data.type === 'pong') {
            console.log('Pong reçu - connexion stable');
            return;
          }
          
          if (data.type === 'new_message' && onMessage) {
            console.log('Nouveau message traité:', data.message);
            onMessage(data.message);
          }
        } catch (error) {
          console.error('Erreur lors du parsing du message WebSocket:', error, event.data);
          setError(`Erreur de parsing: ${error.message}`);
        }
      };

      ws.current.onclose = (event) => {
        clearTimeout(connectionTimeout);
        cleanup();
        
        if (!mountedRef.current) return;
        
        console.log('WebSocket fermé:', event.code, event.reason);
        setConnectionState('disconnected');
        
        // Codes d'erreur spécifiques
        if (event.code === 4001) {
          setError('Authentification échouée');
          console.error('Authentification WebSocket échouée');
          return;
        }
        
        if (event.code === 4000) {
          setError('Erreur de connexion du serveur');
        }

        // Si la fermeture est propre, ne pas reconnecter
        if (event.code === 1000 || event.code === 1001) {
          console.log('Connexion fermée proprement');
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