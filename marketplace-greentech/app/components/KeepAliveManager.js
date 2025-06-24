'use client';

import { useEffect, useState } from 'react';
import keepAliveService from '@/lib/services/keepAliveService';

/**
 * Composant pour gérer le service Keep-Alive
 * Maintient le serveur Render actif automatiquement
 */
export default function KeepAliveManager({ showStatus = false }) {
  const [status, setStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Démarrer le service
    keepAliveService.start();

    // Mettre à jour le statut périodiquement si affiché
    let statusInterval;
    if (showStatus) {
      const updateStatus = () => {
        setStatus(keepAliveService.getStatus());
      };
      
      updateStatus();
      statusInterval = setInterval(updateStatus, 30000); // Toutes les 30 secondes
    }

    // Nettoyage
    return () => {
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    };
  }, [showStatus]);

  // Gestion de la visibilité de la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page cachée - continuer le service en arrière-plan
        console.log('🔄 Keep-alive: Page cachée, service continue en arrière-plan');
      } else {
        // Page visible - s'assurer que le service fonctionne
        console.log('🔄 Keep-alive: Page visible, vérification du service');
        if (keepAliveService.shouldBeActive() && !keepAliveService.getStatus().isRunning) {
          keepAliveService.start();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Formatage du temps
  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (date) => {
    if (!date) return 'Jamais';
    return new Date(date).toLocaleTimeString();
  };

  // Interface de statut (optionnelle)
  if (!showStatus || !status) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-3 min-w-[250px]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Keep-Alive Status
            </h4>
            <div className={`w-3 h-3 rounded-full ${
              status.isRunning ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
          </div>
          
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>État:</span>
              <span className={status.isRunning ? 'text-green-600' : 'text-red-600'}>
                {status.isRunning ? 'Actif' : 'Arrêté'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Dernier ping:</span>
              <span>{formatDate(status.lastPingTime)}</span>
            </div>
            
            {status.isRunning && (
              <div className="flex justify-between">
                <span>Prochain ping:</span>
                <span>{formatTime(status.nextPingIn)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Échecs:</span>
              <span className={status.failureCount > 0 ? 'text-orange-600' : 'text-green-600'}>
                {status.failureCount}
              </span>
            </div>
            
            {status.backendUrl && (
              <div className="pt-1 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-500 truncate">
                  {status.backendUrl}
                </div>
              </div>
            )}
          </div>
          
          {isVisible && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => keepAliveService.manualPing()}
                className="w-full text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Ping Manuel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Version simplifiée sans interface utilisateur
 */
export function KeepAliveBackground() {
  useEffect(() => {
    keepAliveService.start();
    
    return () => {
      // Ne pas arrêter le service quand le composant se démonte
      // Il doit continuer à fonctionner en arrière-plan
    };
  }, []);

  return null;
}
