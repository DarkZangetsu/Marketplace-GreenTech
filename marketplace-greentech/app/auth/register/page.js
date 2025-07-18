/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Shield, Clock, RefreshCw } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '@/lib/graphql/mutations';
import toast, { Toaster } from 'react-hot-toast';
import emailService from '@/lib/services/emailService';
import verificationService from '@/lib/services/verificationService';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // États pour la vérification d'email
  const [currentStep, setCurrentStep] = useState('form'); // 'form' ou 'verification'
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      if (data.register.success) {
        toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        // Redirection vers la page de connexion au lieu du dashboard
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500); // Délai pour permettre à l'utilisateur de voir le message de succès
      } else {
        setError(data.register.message);
        toast.error(data.register.message);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      console.error('Registration error:', error);
      toast.error('Erreur lors de l\'inscription');
      setIsLoading(false);
    }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validation des champs requis
    if (!formData.username || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez saisir un email valide');
      toast.error('Veuillez saisir un email valide');
      return;
    }

    // Si on est à l'étape du formulaire, envoyer le code de vérification
    if (currentStep === 'form') {
      await sendVerificationCode();
    } else if (currentStep === 'verification') {
      // Si on est à l'étape de vérification, vérifier le code
      await verifyEmailCode();
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // Timer pour le countdown de renvoi de code
  useEffect(() => {
    let interval;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Fonction pour envoyer le code de vérification
  const sendVerificationCode = async () => {
    if (!formData.email) {
      toast.error('Veuillez saisir votre email');
      return;
    }

    setIsSendingCode(true);
    setError('');

    try {
      const result = await emailService.sendVerificationCode(
        formData.email
      );

      if (result.success) {
        toast.success(result.message);
        setCurrentStep('verification');
        setTimeRemaining(600); // 10 minutes
        setCanResend(false);
      } else {
        toast.error(result.message);
        setError(result.message);
      }
    } catch (error) {
      console.error('Erreur envoi code:', error);
      toast.error('Erreur lors de l\'envoi du code');
      setError('Erreur lors de l\'envoi du code');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Fonction pour renvoyer le code
  const resendVerificationCode = async () => {
    setIsSendingCode(true);
    setError('');

    try {
      const result = await emailService.resendVerificationCode(
        formData.email
      );

      if (result.success) {
        toast.success(result.message);
        setTimeRemaining(600); // 10 minutes
        setCanResend(false);
      } else {
        toast.error(result.message);
        setError(result.message);
      }
    } catch (error) {
      console.error('Erreur renvoi code:', error);
      toast.error('Erreur lors du renvoi du code');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Fonction pour vérifier le code
  const verifyEmailCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Veuillez saisir un code à 6 chiffres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = verificationService.verifyCode(formData.email, verificationCode);

      if (result.success) {
        toast.success(result.message);
        // Procéder à l'inscription
        await registerUser({
          variables: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber
          }
        });
      } else {
        toast.error(result.message);
        setError(result.message);
      }
    } catch (error) {
      console.error('Erreur vérification code:', error);
      toast.error('Erreur lors de la vérification');
      setError('Erreur lors de la vérification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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
          <div className="w-full max-w-7xl">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row min-h-[700px]">

                {/* Partie gauche - Formulaire */}
                <div className="lg:w-3/5 p-6 lg:p-12 flex flex-col justify-center">
                  <div className="w-full max-w-xl mx-auto">

                    {/* En-tête du formulaire */}
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentStep === 'form' ? 'Créer un compte' : 'Vérification d\'email'}
                      </h2>
                      <p className="text-gray-600">
                        {currentStep === 'form'
                          ? 'Rejoignez GreenTech et commencez votre aventure écologique'
                          : `Un code de vérification a été envoyé à ${formData.email}`
                        }
                      </p>

                      {/* Indicateur d'étapes */}
                      <div className="flex items-center mt-4 space-x-2">
                        <div className={`w-3 h-3 rounded-full ${currentStep === 'form' ? 'bg-green-500' : 'bg-green-500'}`}></div>
                        <div className={`w-8 h-0.5 ${currentStep === 'verification' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`w-3 h-3 rounded-full ${currentStep === 'verification' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-xs text-gray-500 ml-2">
                          {currentStep === 'form' ? 'Étape 1/2' : 'Étape 2/2'}
                        </span>
                      </div>
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
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {currentStep === 'form' ? (
                        <>
                          {/* Nom d'utilisateur */}
                          <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                              Nom d'utilisateur
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                placeholder="johndoe"
                              />
                            </div>
                          </div>

                          {/* Email */}
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
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                placeholder="votre@email.com"
                              />
                            </div>
                          </div>

                          {/* Prénom et Nom */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Prénom
                              </label>
                              <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                placeholder="John"
                              />
                            </div>

                            <div>
                              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nom de famille
                              </label>
                              <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                placeholder="Doe"
                              />
                            </div>
                          </div>

                          {/* Téléphone */}
                          <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                              Numéro de téléphone
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                placeholder="+261 34 00 000 00"
                              />
                            </div>
                          </div>

                          {/* Mot de passe */}
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
                                required
                                value={formData.password}
                                onChange={handleChange}
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

                          {/* Conditions d'utilisation */}
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                              required
                            />
                            <label className="ml-2 text-sm text-gray-600">
                              J'accepte les{' '}
                              <Link href="/terms" className="text-green-600 hover:text-green-500 font-medium">
                                conditions d'utilisation
                              </Link>{' '}
                              et la{' '}
                              <Link href="/privacy" className="text-green-600 hover:text-green-500 font-medium">
                                politique de confidentialité
                              </Link>
                            </label>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Étape de vérification d'email */}
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Mail className="h-8 w-8 text-green-600" />
                            </div>
                            <p className="text-gray-600 mb-6">
                              Saisissez le code de vérification à 6 chiffres envoyé à votre adresse email.
                            </p>
                          </div>

                          {/* Champ de saisie du code */}
                          <div>
                            <label htmlFor="verificationCode" className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                              Code de vérification
                            </label>
                            <input
                              id="verificationCode"
                              name="verificationCode"
                              type="text"
                              maxLength="6"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                              placeholder="000000"
                              autoComplete="off"
                            />
                          </div>

                          {/* Timer et bouton de renvoi */}
                          <div className="text-center">
                            {timeRemaining > 0 ? (
                              <p className="text-sm text-gray-500">
                                <Clock className="inline h-4 w-4 mr-1" />
                                Code valide pendant {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                              </p>
                            ) : (
                              <button
                                type="button"
                                onClick={resendVerificationCode}
                                disabled={isSendingCode || !canResend}
                                className="text-green-600 hover:text-green-500 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                              >
                                <RefreshCw className={`h-4 w-4 mr-1 ${isSendingCode ? 'animate-spin' : ''}`} />
                                {isSendingCode ? 'Envoi en cours...' : 'Renvoyer le code'}
                              </button>
                            )}
                          </div>

                          {/* Bouton retour */}
                          <button
                            type="button"
                            onClick={() => setCurrentStep('form')}
                            className="w-full text-gray-600 hover:text-gray-800 font-medium text-sm"
                          >
                            ← Retour au formulaire
                          </button>
                        </>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading || isSendingCode || (currentStep === 'verification' && verificationCode.length !== 6)}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {currentStep === 'form' ? 'Envoi du code...' : 'Inscription en cours...'}
                          </div>
                        ) : isSendingCode ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Envoi du code...
                          </div>
                        ) : (
                          currentStep === 'form' ? 'Envoyer le code de vérification' : 'Vérifier et créer mon compte'
                        )}
                      </button>
                    </form>

                    {/* Séparateur */}
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white text-gray-500 font-medium">Ou créer un compte avec</span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                          </svg>
                          <span className="ml-2">Google</span>
                        </button>

                        <button
                          type="button"
                          className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          <span className="ml-2">Facebook</span>
                        </button>
                      </div>
                    </div>

                    {/* Lien de connexion */}
                    <div className="mt-6 text-center">
                      <p className="text-gray-600 text-sm">
                        Déjà un compte ?{' '}
                        <Link
                          href="/auth/login"
                          className="font-semibold text-green-600 hover:text-green-500 transition-colors"
                        >
                          Se connecter
                        </Link>
                      </p>
                    </div>

                  </div>
                </div>

                {/* Partie droite - Textes et branding */}
                <div className="lg:w-2/5 bg-gradient-to-br from-green-600 to-green-800 p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden">
                  {/* Éléments décoratifs */}
                  <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 -translate-x-32"></div>
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 translate-x-24"></div>

                  <div className="relative z-10">
                    {/* Titre principal */}
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                      Rejoignez le
                      <br />
                      <span className="text-green-200">mouvement circulaire</span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-green-100 mb-8 leading-relaxed">
                      Participez à la révolution de la construction durable à Madagascar. Transformez les déchets en ressources précieuses.
                    </p>

                    {/* Avantages */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-300 rounded-full mr-4"></div>
                        <span className="text-green-100">Inscription gratuite et rapide</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-300 rounded-full mr-4"></div>
                        <span className="text-green-100">Accès à des milliers de matériaux</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-300 rounded-full mr-4"></div>
                        <span className="text-green-100">Réseau local d'artisans et constructeurs</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-300 rounded-full mr-4"></div>
                        <span className="text-green-100">Impact environnemental positif</span>
                      </div>
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