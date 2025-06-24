'use client';

import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

/**
 * Composant pour nettoyer automatiquement les tokens JWT invalides
 * Utile quand on change d'environnement (local <-> production)
 */
export default function AuthCleaner() {
  useEffect(() => {
    const cleanInvalidTokens = () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Essayer de décoder le token
          const decoded = jwtDecode(token);
          
          // Vérifier si le token est expiré
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            console.log('🧹 Token expiré détecté, nettoyage...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('refreshToken');
            
            // Recharger la page pour réinitialiser l'état
            window.location.reload();
          }
        }
      } catch (error) {
        // Si le décodage échoue, c'est probablement un token invalide
        console.log('🧹 Token invalide détecté, nettoyage...', error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        
        // Recharger la page pour réinitialiser l'état
        window.location.reload();
      }
    };

    // Nettoyer au montage du composant
    cleanInvalidTokens();

    // Nettoyer aussi quand l'URL de l'API change (changement d'environnement)
    const currentApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const storedApiUrl = localStorage.getItem('lastApiUrl');
    
    if (storedApiUrl && storedApiUrl !== currentApiUrl) {
      console.log('🔄 Changement d\'environnement détecté, nettoyage des tokens...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      window.location.reload();
    }
    
    // Stocker l'URL actuelle pour la prochaine fois
    localStorage.setItem('lastApiUrl', currentApiUrl);

  }, []);

  // Ce composant ne rend rien
  return null;
}
