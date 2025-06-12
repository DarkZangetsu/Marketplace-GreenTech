'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function WebSocketDiagnostic({ userId }) {
  const [diagnostics, setDiagnostics] = useState({
    wsUrl: '',
    connectionState: 'idle',
    error: null,
    latency: null,
    serverReachable: null,
    tokenValid: null
  });

  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics(prev => ({ ...prev, connectionState: 'testing' }));

    try {
      // 1. Vérifier l'URL WebSocket
      const baseWsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://marketplace-greentech.onrender.com';
      const wsUrl = `${baseWsUrl}/ws/messages/${userId}/`;
      
      setDiagnostics(prev => ({ ...prev, wsUrl }));

      // 2. Vérifier si le serveur est accessible via HTTP
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-greentech.onrender.com';
      const startTime = Date.now();
      
      try {
        const response = await fetch(`${apiUrl}/graphql/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '{ __schema { types { name } } }' })
        });
        
        const latency = Date.now() - startTime;
        setDiagnostics(prev => ({ 
          ...prev, 
          serverReachable: response.ok,
          latency: latency
        }));
      } catch (error) {
        setDiagnostics(prev => ({ 
          ...prev, 
          serverReachable: false,
          error: `Serveur inaccessible: ${error.message}`
        }));
      }

      // 3. Vérifier le token
      const token = localStorage.getItem('token');
      setDiagnostics(prev => ({ 
        ...prev, 
        tokenValid: !!token
      }));

      // 4. Tester la connexion WebSocket
      const testWs = new WebSocket(wsUrl + (token ? `?token=${encodeURIComponent(token)}` : ''));
      
      const wsTimeout = setTimeout(() => {
        testWs.close();
        setDiagnostics(prev => ({ 
          ...prev, 
          connectionState: 'timeout',
          error: 'Timeout de connexion WebSocket (30s)'
        }));
      }, 30000);

      testWs.onopen = () => {
        clearTimeout(wsTimeout);
        setDiagnostics(prev => ({ 
          ...prev, 
          connectionState: 'connected',
          error: null
        }));
        
        // Fermer la connexion de test
        setTimeout(() => {
          testWs.close();
        }, 1000);
      };

      testWs.onerror = (error) => {
        clearTimeout(wsTimeout);
        setDiagnostics(prev => ({ 
          ...prev, 
          connectionState: 'error',
          error: 'Erreur de connexion WebSocket'
        }));
      };

      testWs.onclose = (event) => {
        clearTimeout(wsTimeout);
        if (event.code !== 1000) {
          setDiagnostics(prev => ({ 
            ...prev, 
            connectionState: 'closed',
            error: `WebSocket fermé avec le code: ${event.code} - ${event.reason || 'Raison inconnue'}`
          }));
        }
      };

    } catch (error) {
      setDiagnostics(prev => ({ 
        ...prev, 
        connectionState: 'error',
        error: error.message
      }));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
      case 'timeout':
      case 'closed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'testing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <WifiOff className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50';
      case 'error':
      case 'timeout':
      case 'closed':
        return 'text-red-600 bg-red-50';
      case 'testing':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Wifi className="w-5 h-5" />
          Diagnostic WebSocket
        </h3>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {isRunning ? 'Test en cours...' : 'Lancer le test'}
        </button>
      </div>

      <div className="space-y-4">
        {/* URL WebSocket */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">URL WebSocket:</span>
          <span className="text-sm text-gray-600 font-mono">
            {diagnostics.wsUrl || 'Non définie'}
          </span>
        </div>

        {/* État de la connexion */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">État de la connexion:</span>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(diagnostics.connectionState)}`}>
            {getStatusIcon(diagnostics.connectionState)}
            <span className="text-sm font-medium capitalize">
              {diagnostics.connectionState === 'idle' ? 'Non testé' : diagnostics.connectionState}
            </span>
          </div>
        </div>

        {/* Serveur accessible */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Serveur accessible:</span>
          <div className="flex items-center gap-2">
            {diagnostics.serverReachable === null ? (
              <span className="text-gray-500">Non testé</span>
            ) : diagnostics.serverReachable ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Oui</span>
                {diagnostics.latency && (
                  <span className="text-sm text-gray-500">({diagnostics.latency}ms)</span>
                )}
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-600">Non</span>
              </>
            )}
          </div>
        </div>

        {/* Token valide */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Token d'authentification:</span>
          <div className="flex items-center gap-2">
            {diagnostics.tokenValid === null ? (
              <span className="text-gray-500">Non vérifié</span>
            ) : diagnostics.tokenValid ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Présent</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-600">Manquant</span>
              </>
            )}
          </div>
        </div>

        {/* Erreur */}
        {diagnostics.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Erreur détectée:</h4>
                <p className="text-sm text-red-600 mt-1">{diagnostics.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommandations */}
        {diagnostics.connectionState === 'error' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Recommandations:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Vérifiez que le service backend est démarré sur Render</li>
              <li>• Vérifiez que Redis est configuré et actif</li>
              <li>• Vérifiez les variables d'environnement REDIS_URL</li>
              <li>• Les services Render gratuits peuvent avoir des délais de démarrage</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
