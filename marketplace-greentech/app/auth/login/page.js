/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '@/lib/graphql/mutations';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      if (data.login.success) {
        // Stocker le token
        localStorage.setItem('token', data.login.token);
        
        // Créer l'objet utilisateur avec isStaff explicite
        const userData = {
          ...data.login.user,
          isStaff: Boolean(data.login.isStaff) // S'assurer que c'est un booléen
        };
        
        // Stocker les données utilisateur
        localStorage.setItem('user', JSON.stringify(userData));
  
        // Dispatcher l'événement d'authentification
        window.dispatchEvent(new CustomEvent('authChanged', {
          detail: { 
            isAuthenticated: true, 
            user: userData 
          }
        }));
  
        toast.success('Connexion réussie !');
  
        setTimeout(() => {
          if (userData.isStaff) {
            window.location.href = '/admin';
          } else {
            window.location.href = '/dashboard';
          }
        }, 1000);
      } else {
        setError(data.login.message);
        toast.error(data.login.message);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      setError('Erreur lors de la connexion. Veuillez réessayer.');
      toast.error('Erreur lors de la connexion');
      console.error('Login error:', error);
      setIsLoading(false);
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginUser({
        variables: {
          email,
          password
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Bouton retour */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          </button>
        </div>

        <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-6xl">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row min-h-[600px]">

                {/* Partie gauche - Textes et branding */}
                <div className="lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden">
                  {/* Éléments décoratifs */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

                  <div className="relative z-10">

                    {/* Titre principal */}
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                      Bienvenue sur
                      <br />
                      <span className="text-green-200">GreenTech Marketplace</span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-green-100 mb-8 leading-relaxed">
                      Rejoignez la plateforme malgache de réutilisation de matériaux. Donnez une seconde vie aux matériaux de construction et d'artisanat.
                    </p>

                    {/* Points forts */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-300 rounded-full mr-4"></div>
                        <span className="text-green-100">Donnez, récupérez ou achetez à prix réduit</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-300 rounded-full mr-4"></div>
                        <span className="text-green-100">Réduisez les déchets de construction</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-300 rounded-full mr-4"></div>
                        <span className="text-green-100">Communauté locale engagée</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partie droite - Formulaire */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="w-full max-w-md mx-auto">

                    {/* En-tête du formulaire */}
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Connexion
                      </h2>
                      <p className="text-gray-600">
                        Accédez à votre compte GreenTech
                      </p>
                    </div>

                    {/* Message d'erreur */}
                    {error && (
                      <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Adresse email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder="votre@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                          Mot de passe
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                        </label>
                        <Link
                          href="/auth/forgot-password"
                          className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors"
                        >
                          Mot de passe oublié ?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Connexion en cours...
                          </div>
                        ) : (
                          'Se connecter'
                        )}
                      </button>
                    </form>

                    {/* Séparateur */}
                    <div className="mt-8">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white text-gray-500 font-medium">Ou continuer avec</span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className="flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                          </svg>
                          <span className="ml-2">Google</span>
                        </button>

                        <button
                          type="button"
                          className="flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          <span className="ml-2">Facebook</span>
                        </button>
                      </div>
                    </div>

                    {/* Lien d'inscription */}
                    <div className="mt-8 text-center">
                      <p className="text-gray-600">
                        Pas encore de compte ?{' '}
                        <Link
                          href="/auth/register"
                          className="font-semibold text-green-600 hover:text-green-500 transition-colors"
                        >
                          Créer un compte gratuitement
                        </Link>
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}