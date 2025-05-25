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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Changer de mot de passe</h1>
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center mb-6">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Votre mot de passe a été changé avec succès.</span>
          </div>
        )}
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
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Changement...' : 'Changer le mot de passe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 