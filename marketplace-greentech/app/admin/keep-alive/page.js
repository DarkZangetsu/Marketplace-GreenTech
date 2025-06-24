'use client';

import { useState, useEffect } from 'react';
import { Activity, Server, Clock, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import keepAliveService from '@/lib/services/keepAliveService';

export default function KeepAlivePage() {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({
    interval: 10,
    enabled: true,
  });

  useEffect(() => {
    // Mettre à jour le statut toutes les 5 secondes
    const updateStatus = () => {
      setStatus(keepAliveService.getStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleManualPing = async () => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time: timestamp, message: 'Ping manuel initié...', type: 'info' }]);
    
    try {
      const success = await keepAliveService.manualPing();
      setLogs(prev => [...prev, { 
        time: new Date().toLocaleTimeString(), 
        message: success ? 'Ping manuel réussi' : 'Ping manuel échoué', 
        type: success ? 'success' : 'error' 
      }]);
    } catch (error) {
      setLogs(prev => [...prev, { 
        time: new Date().toLocaleTimeString(), 
        message: `Erreur ping: ${error.message}`, 
        type: 'error' 
      }]);
    }
  };

  const handleToggleService = () => {
    if (status?.isRunning) {
      keepAliveService.stop();
      setLogs(prev => [...prev, { 
        time: new Date().toLocaleTimeString(), 
        message: 'Service arrêté manuellement', 
        type: 'warning' 
      }]);
    } else {
      keepAliveService.start();
      setLogs(prev => [...prev, { 
        time: new Date().toLocaleTimeString(), 
        message: 'Service démarré manuellement', 
        type: 'success' 
      }]);
    }
  };

  const handleIntervalChange = (newInterval) => {
    try {
      keepAliveService.setInterval(newInterval);
      setSettings(prev => ({ ...prev, interval: newInterval }));
      setLogs(prev => [...prev, { 
        time: new Date().toLocaleTimeString(), 
        message: `Intervalle mis à jour: ${newInterval} minutes`, 
        type: 'info' 
      }]);
    } catch (error) {
      setLogs(prev => [...prev, { 
        time: new Date().toLocaleTimeString(), 
        message: `Erreur intervalle: ${error.message}`, 
        type: 'error' 
      }]);
    }
  };

  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (date) => {
    if (!date) return 'Jamais';
    return new Date(date).toLocaleString();
  };

  const getStatusColor = () => {
    if (!status) return 'gray';
    if (status.isRunning && status.failureCount === 0) return 'green';
    if (status.isRunning && status.failureCount > 0) return 'yellow';
    return 'red';
  };

  const getStatusIcon = () => {
    const color = getStatusColor();
    if (color === 'green') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (color === 'yellow') return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Activity className="h-8 w-8 mr-3 text-blue-600" />
            Keep-Alive Service
          </h1>
          <p className="text-gray-600 mt-2">
            Surveillance et gestion du service de maintien du serveur Render
          </p>
        </div>

        {/* Statut principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Statut</h3>
                <p className={`text-sm ${getStatusColor() === 'green' ? 'text-green-600' : 
                  getStatusColor() === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {status?.isRunning ? 'Service actif' : 'Service arrêté'}
                </p>
              </div>
              {getStatusIcon()}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Dernier ping</h3>
                <p className="text-sm text-gray-600">
                  {formatDate(status?.lastPingTime)}
                </p>
              </div>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Échecs</h3>
                <p className={`text-sm ${status?.failureCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {status?.failureCount || 0} échecs
                </p>
              </div>
              <Server className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Détails et contrôles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations détaillées */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations détaillées</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">URL du backend:</span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {status?.backendUrl || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prochain ping dans:</span>
                <span className="text-sm">{formatTime(status?.nextPingIn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Intervalle:</span>
                <span className="text-sm">{settings.interval} minutes</span>
              </div>
            </div>
          </div>

          {/* Contrôles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Contrôles
            </h3>
            <div className="space-y-4">
              <button
                onClick={handleToggleService}
                className={`w-full px-4 py-2 rounded-lg font-medium ${
                  status?.isRunning 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {status?.isRunning ? 'Arrêter le service' : 'Démarrer le service'}
              </button>

              <button
                onClick={handleManualPing}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Ping manuel
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalle (minutes)
                </label>
                <select
                  value={settings.interval}
                  onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Logs d'activité</h3>
            <button
              onClick={() => setLogs([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Effacer
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center">Aucun log disponible</p>
            ) : (
              <div className="space-y-2">
                {logs.slice(-20).reverse().map((log, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-xs text-gray-500 w-20 flex-shrink-0">
                      {log.time}
                    </span>
                    <span className={`text-sm ${
                      log.type === 'success' ? 'text-green-600' :
                      log.type === 'error' ? 'text-red-600' :
                      log.type === 'warning' ? 'text-yellow-600' :
                      'text-gray-700'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
