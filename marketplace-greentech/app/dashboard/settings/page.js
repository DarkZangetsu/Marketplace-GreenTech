/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Save, Bell, Lock, User,  Trash2 } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { CHANGE_PASSWORD } from '@/lib/graphql/mutations';

// Mock user settings
const mockSettings = {
  account: {
    email: 'rakoto.jean@example.com',
    phone: '+261 34 00 000 00',
    language: 'fr',
    currency: 'MGA',
  },
  notifications: {
    emailMessages: true,
    emailListingUpdates: true,
    emailMarketing: false,
    smsMessages: false,
    smsListingUpdates: false,
  },
  privacy: {
    showPhone: false,
    showEmail: false,
    showLocation: true,
    allowSearchEngines: true,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: (data) => {
      if (data.changePassword.success) {
        setSaveSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setPasswordError(data.changePassword.message || 'Erreur inconnue');
      }
    },
    onError: (error) => {
      setPasswordError(error.message || 'Erreur lors du changement de mot de passe');
    }
  });

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        [name]: value
      }
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [name]: checked
      }
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError('Veuillez saisir votre mot de passe actuel');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    await changePassword({ variables: { oldPassword: currentPassword, newPassword } });
  };

  const handleSaveSettings = () => {
    // In a real app, we would call an API to save the settings
    console.log('Settings saved:', settings);
    
    // Show success message
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos préférences de compte et de confidentialité
          </p>
        </div>
        
        {/* Success message */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Vos paramètres ont été enregistrés avec succès.</span>
          </div>
        )}
        
        {/* Settings content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Paramètres</h2>
              </div>
              <div className="p-2">
                <button
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'account' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('account')}
                >
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    <span>Compte</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'notifications' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <div className="flex items-center">
                    <Bell size={16} className="mr-2" />
                    <span>Notifications</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'privacy' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('privacy')}
                >
                  <div className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    <span>Confidentialité</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'password' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('password')}
                >
                  <div className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    <span>Mot de passe</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* Settings panel */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres du compte</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse e-mail
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={settings.account.email}
                          onChange={handleAccountChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Numéro de téléphone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={settings.account.phone}
                          onChange={handleAccountChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                          Langue
                        </label>
                        <select
                          id="language"
                          name="language"
                          value={settings.account.language}
                          onChange={handleAccountChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="fr">Français</option>
                          <option value="mg">Malagasy</option>
                          <option value="en">Anglais</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                          Devise
                        </label>
                        <select
                          id="currency"
                          name="currency"
                          value={settings.account.currency}
                          onChange={handleAccountChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="MGA">Ariary (MGA)</option>
                          <option value="EUR">Euro (EUR)</option>
                          <option value="USD">Dollar américain (USD)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-red-600 mb-4">Zone de danger</h3>
                      <button
                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres de notification</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications par e-mail</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="emailMessages"
                              name="emailMessages"
                              type="checkbox"
                              checked={settings.notifications.emailMessages}
                              onChange={handleNotificationChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="emailMessages" className="font-medium text-gray-700">Messages</label>
                            <p className="text-gray-500">Recevoir des notifications par e-mail lorsque vous recevez un nouveau message.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="emailListingUpdates"
                              name="emailListingUpdates"
                              type="checkbox"
                              checked={settings.notifications.emailListingUpdates}
                              onChange={handleNotificationChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="emailListingUpdates" className="font-medium text-gray-700">Activité des annonces</label>
                            <p className="text-gray-500">Recevoir des notifications par e-mail concernant l'activité sur vos annonces.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="emailMarketing"
                              name="emailMarketing"
                              type="checkbox"
                              checked={settings.notifications.emailMarketing}
                              onChange={handleNotificationChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="emailMarketing" className="font-medium text-gray-700">Marketing</label>
                            <p className="text-gray-500">Recevoir des e-mails sur les nouveautés et les promotions.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications par SMS</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="smsMessages"
                              name="smsMessages"
                              type="checkbox"
                              checked={settings.notifications.smsMessages}
                              onChange={handleNotificationChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="smsMessages" className="font-medium text-gray-700">Messages</label>
                            <p className="text-gray-500">Recevoir des notifications par SMS lorsque vous recevez un nouveau message.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="smsListingUpdates"
                              name="smsListingUpdates"
                              type="checkbox"
                              checked={settings.notifications.smsListingUpdates}
                              onChange={handleNotificationChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="smsListingUpdates" className="font-medium text-gray-700">Activité des annonces</label>
                            <p className="text-gray-500">Recevoir des notifications par SMS concernant l'activité sur vos annonces.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres de confidentialité</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de contact</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="showPhone"
                              name="showPhone"
                              type="checkbox"
                              checked={settings.privacy.showPhone}
                              onChange={handlePrivacyChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="showPhone" className="font-medium text-gray-700">Afficher mon numéro de téléphone</label>
                            <p className="text-gray-500">Permettre aux autres utilisateurs de voir votre numéro de téléphone sur vos annonces.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="showEmail"
                              name="showEmail"
                              type="checkbox"
                              checked={settings.privacy.showEmail}
                              onChange={handlePrivacyChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="showEmail" className="font-medium text-gray-700">Afficher mon adresse e-mail</label>
                            <p className="text-gray-500">Permettre aux autres utilisateurs de voir votre adresse e-mail sur vos annonces.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Visibilité</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="showLocation"
                              name="showLocation"
                              type="checkbox"
                              checked={settings.privacy.showLocation}
                              onChange={handlePrivacyChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="showLocation" className="font-medium text-gray-700">Afficher ma localisation</label>
                            <p className="text-gray-500">Permettre aux autres utilisateurs de voir votre ville sur votre profil.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="allowSearchEngines"
                              name="allowSearchEngines"
                              type="checkbox"
                              checked={settings.privacy.allowSearchEngines}
                              onChange={handlePrivacyChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="allowSearchEngines" className="font-medium text-gray-700">Indexation par les moteurs de recherche</label>
                            <p className="text-gray-500">Autoriser les moteurs de recherche à indexer vos annonces et votre profil.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Password Settings */}
              {activeTab === 'password' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Changer de mot de passe</h2>
                  
                  {passwordError && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
                      {passwordError}
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Le mot de passe doit contenir au moins 8 caractères.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Changement...' : 'Changer le mot de passe'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Save button (for account, notifications, privacy) */}
              {(activeTab === 'account' || activeTab === 'notifications' || activeTab === 'privacy') && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                    className="btn btn-primary flex items-center gap-2"
                    onClick={handleSaveSettings}
                  >
                    <Save size={18} />
                    <span>Enregistrer les modifications</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Supprimer votre compte</h3>
            <p className="text-gray-600 mb-6 text-center">
              Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible et toutes vos données seront définitivement supprimées.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer définitivement mon compte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 