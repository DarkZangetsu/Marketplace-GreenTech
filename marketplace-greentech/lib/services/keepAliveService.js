/**
 * Service Keep-Alive pour maintenir le serveur Render actif
 * Envoie des requêtes périodiques pour éviter que le serveur s'éteigne
 */

class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    this.lastPingTime = null;
    this.failureCount = 0;
    this.maxFailures = 3;
    
    // Configuration
    this.pingInterval = 10 * 60 * 1000; // 10 minutes en millisecondes
    this.timeout = 30000; // 30 secondes timeout
    
    // URLs à pinger
    this.endpoints = [
      '/api/health/',  // Endpoint de santé
      '/graphql/',     // Endpoint GraphQL
    ];
    
    this.currentEndpointIndex = 0;
  }

  /**
   * Obtient l'URL de base du backend selon l'environnement
   */
  getBackendUrl() {
    // En production, utiliser l'URL de Render
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-greentech.onrender.com';
    }
    
    // En développement, vérifier si on utilise le serveur distant
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && apiUrl.includes('onrender.com')) {
      return apiUrl;
    }
    
    // Si localhost, pas besoin de keep-alive
    return null;
  }

  /**
   * Vérifie si le service doit être actif
   */
  shouldBeActive() {
    const backendUrl = this.getBackendUrl();
    return backendUrl && backendUrl.includes('onrender.com');
  }

  /**
   * Ping le serveur backend
   */
  async pingServer() {
    const backendUrl = this.getBackendUrl();
    if (!backendUrl) {
      console.log('🔄 Keep-alive: Backend local détecté, service désactivé');
      this.stop();
      return false;
    }

    const endpoint = this.endpoints[this.currentEndpointIndex];
    const url = `${backendUrl}${endpoint}`;
    
    try {
      console.log(`🔄 Keep-alive: Ping ${url}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'GreenTech-KeepAlive/1.0',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`✅ Keep-alive: Serveur actif (${response.status})`);
        this.lastPingTime = new Date();
        this.failureCount = 0;
        
        // Alterner entre les endpoints
        this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
        
        return true;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      this.failureCount++;
      if (this.failureCount >= this.maxFailures) {
        this.stop();
        
        // Redémarrer après 5 minutes
        setTimeout(() => {
          if (this.shouldBeActive()) {
            this.start();
          }
        }, 5 * 60 * 1000);
      }
      
      return false;
    }
  }

  /**
   * Démarre le service keep-alive
   */
  start() {
    if (this.isRunning) {
      return;
    }

    if (!this.shouldBeActive()) {
      return;
    }
    this.isRunning = true;
    this.failureCount = 0;
    
    // Premier ping immédiat
    this.pingServer();
    
    // Puis ping périodique
    this.intervalId = setInterval(() => {
      this.pingServer();
    }, this.pingInterval);
  }

  /**
   * Arrête le service keep-alive
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isRunning = false;
  }

  /**
   * Redémarre le service
   */
  restart() {
    this.stop();
    setTimeout(() => this.start(), 1000);
  }

  /**
   * Obtient le statut du service
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastPingTime: this.lastPingTime,
      failureCount: this.failureCount,
      backendUrl: this.getBackendUrl(),
      nextPingIn: this.isRunning ? 
        Math.max(0, this.pingInterval - (Date.now() - (this.lastPingTime?.getTime() || 0))) : 0,
    };
  }

  /**
   * Ping manuel pour tester
   */
  async manualPing() {
    return await this.pingServer();
  }

  /**
   * Configure l'intervalle de ping
   */
  setInterval(minutes) {
    if (minutes < 1 || minutes > 60) {
      throw new Error('L\'intervalle doit être entre 1 et 60 minutes');
    }
    
    this.pingInterval = minutes * 60 * 1000;
    
    if (this.isRunning) {
      this.restart();
    }
  }
}

// Exporter une instance unique (singleton)
const keepAliveService = new KeepAliveService();

// Auto-démarrage si on est en production ou si on utilise Render
if (typeof window !== 'undefined') {
  // Démarrer après le chargement de la page
  window.addEventListener('load', () => {
    setTimeout(() => {
      keepAliveService.start();
    }, 5000); // Attendre 5 secondes après le chargement
  });

  // Arrêter avant la fermeture de la page
  window.addEventListener('beforeunload', () => {
    keepAliveService.stop();
  });

  // Redémarrer quand la page redevient visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && keepAliveService.shouldBeActive()) {
      keepAliveService.start();
    }
  });
}

export default keepAliveService;
