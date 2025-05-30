/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Recycle, Heart, Globe, ShieldCheck, Users, BadgeCheck, Truck,
  ArrowRight, Sparkles, Target, Eye, Award, TrendingUp,
  CheckCircle, Star, Zap, Leaf
} from 'lucide-react';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section - Modernisé avec gradient et animations */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background avec gradient animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          {/* Formes géométriques animées */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-300/15 rounded-full blur-lg animate-ping"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge moderne */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Plateforme innovante</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              À propos de
              <span className="block text-transparent bg-gradient-to-r from-green-200 to-emerald-300 bg-clip-text">
                GreenTech
              </span>
            </h1>

            <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90 leading-relaxed mb-12">
              Une plateforme révolutionnaire qui transforme la façon dont nous pensons
              la réutilisation et le recyclage des matériaux à Madagascar
            </p>

            {/* CTA Buttons modernes */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/listings"
                className="group inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Découvrir la plateforme
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#mission"
                className="group inline-flex items-center gap-2 border-2 border-white/50 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                Notre mission
                <Target className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Mission & Vision - Design moderne avec cartes */}
      <section id="mission" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-2 mb-6">
              <Target className="w-4 h-4" />
              <span className="text-sm font-semibold">Notre raison d'être</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez ce qui nous anime et notre vision pour l'avenir de Madagascar
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Mission Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Notre Mission</h3>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  GreenTech Marketplace révolutionne la gestion des déchets à Madagascar en créant
                  un écosystème numérique où chaque matériau trouve une seconde vie.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Réduire les déchets de construction</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Promouvoir l'économie circulaire</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Connecter les communautés locales</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Notre Vision</h3>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Un Madagascar où l'innovation technologique et la conscience environnementale
                  s'unissent pour créer un avenir durable et prospère.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">Zéro déchet de construction d'ici 2030</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">Leader régional de l'économie circulaire</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">Modèle pour l'Afrique de l'Est</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values - Design moderne avec animations */}
      <section className="py-24 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-gray-700 rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold">Ce qui nous guide</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des principes fondamentaux qui façonnent notre approche et inspirent chacune de nos actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Durabilité */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 text-center h-full flex flex-col">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Recycle className="text-white w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-200 rounded-full animate-ping opacity-75"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Durabilité</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Nous révolutionnons la gestion des ressources pour préserver notre planète et créer un avenir durable.
                </p>
              </div>
            </div>

            {/* Communauté */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 text-center h-full flex flex-col">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Heart className="text-white w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-200 rounded-full animate-ping opacity-75"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Communauté</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Nous tissons des liens solides entre les acteurs locaux pour construire ensemble un écosystème prospère.
                </p>
              </div>
            </div>

            {/* Innovation */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 text-center h-full flex flex-col">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Zap className="text-white w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-200 rounded-full animate-ping opacity-75"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Nous repoussons les limites technologiques pour créer des solutions révolutionnaires et accessibles.
                </p>
              </div>
            </div>

            {/* Intégrité */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 text-center h-full flex flex-col">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="text-white w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-200 rounded-full animate-ping opacity-75"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Intégrité</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  Nous agissons avec transparence, honnêteté et responsabilité dans chacune de nos décisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact - Section avec statistiques animées */}
      <section className="py-24 relative">
        {/* Background moderne */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-700 to-green-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-4 text-white">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <TrendingUp className="w-4 h-4 text-green-200" />
              <span className="text-sm font-semibold">Résultats mesurables</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Notre Impact
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Des chiffres qui témoignent de notre engagement pour un Madagascar plus durable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Recycle className="w-12 h-12 text-green-200" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                500+
              </div>
              <p className="text-green-100 font-medium">Tonnes de matériaux réutilisés</p>
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full mx-auto mt-3"></div>
            </div>

            {/* Stat 2 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-12 h-12 text-blue-200" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                1,200+
              </div>
              <p className="text-blue-100 font-medium">Utilisateurs actifs</p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mx-auto mt-3"></div>
            </div>

            {/* Stat 3 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-12 h-12 text-purple-200" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                50+
              </div>
              <p className="text-purple-100 font-medium">Organisations partenaires</p>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full mx-auto mt-3"></div>
            </div>

            {/* Stat 4 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-12 h-12 text-yellow-200" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                150+
              </div>
              <p className="text-yellow-100 font-medium">Emplois locaux créés</p>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-300 rounded-full mx-auto mt-3"></div>
            </div>
          </div>

          {/* Call to action dans la section impact */}
          <div className="text-center mt-16">
            <p className="text-xl opacity-90 mb-8">
              Rejoignez-nous pour amplifier cet impact positif
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Faire partie du changement
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works - Design moderne avec timeline */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 mb-6">
              <BadgeCheck className="w-4 h-4" />
              <span className="text-sm font-semibold">Processus simple</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comment Ça Marche
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trois étapes simples pour transformer vos déchets en ressources précieuses
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-400 via-blue-500 to-purple-600 rounded-full hidden md:block"></div>

              {/* Steps */}
              <div className="space-y-16 md:space-y-24">
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2 md:text-right">
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Inscription Gratuite</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Créez votre compte en quelques minutes et rejoignez une communauté
                        engagée pour l'environnement. Accédez immédiatement à toutes les fonctionnalités.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="text-white w-10 h-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-200 rounded-full animate-ping opacity-75"></div>
                  </div>

                  <div className="md:w-1/2"></div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2"></div>

                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <BadgeCheck className="text-white w-10 h-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-200 rounded-full animate-ping opacity-75"></div>
                  </div>

                  <div className="md:w-1/2">
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Publication d'Annonces</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Publiez vos matériaux disponibles avec photos et descriptions détaillées.
                        Fixez vos prix ou proposez gratuitement pour maximiser la réutilisation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2 md:text-right">
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Échange & Impact</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Connectez-vous avec d'autres utilisateurs, finalisez vos échanges et
                        contribuez concrètement à un Madagascar plus durable.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Truck className="text-white w-10 h-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-200 rounded-full animate-ping opacity-75"></div>
                  </div>

                  <div className="md:w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Commencer maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section - Design moderne */}
      <section className="py-24 relative overflow-hidden">
        {/* Background moderne */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold">L'équipe qui fait la différence</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des passionnés dédiés à la transformation écologique de Madagascar
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Fondateur - Card spéciale */}
            <div className="mb-16">
              <div className="group relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Photo */}
                    <div className="relative">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                        RF
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          RAKOTOSALAMA Fitahiana Florent
                        </h3>
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full px-4 py-2">
                          <Award className="w-4 h-4" />
                          <span className="font-semibold">Fondateur & Directeur</span>
                        </div>
                      </div>

                      <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        Ingénieur logiciel passionné par l'innovation technologique et l'impact environnemental.
                        Expert en développement de plateformes web et d'applications mobiles, avec une vision
                        claire pour un Madagascar plus durable.
                      </p>

                      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          💻 Développement Full-Stack
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          🌱 Économie Circulaire
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          🚀 Innovation Tech
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Postes à pourvoir */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Responsable des Opérations */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto text-white text-2xl font-bold">
                      ?
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">Poste à Pourvoir</h3>
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1 mb-4">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm font-semibold">Responsable des Opérations</span>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    Spécialiste en logistique et chaîne d'approvisionnement avec une passion
                    pour l'économie circulaire et la gestion durable des ressources.
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Gestion de la logistique</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Optimisation des processus</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Partenariats stratégiques</span>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105"
                  >
                    Postuler
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Responsable Développement Durable */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto text-white text-2xl font-bold">
                      ?
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">Poste à Pourvoir</h3>
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-3 py-1 mb-4">
                    <Leaf className="w-4 h-4" />
                    <span className="text-sm font-semibold">Responsable Développement Durable</span>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    Expert en développement durable avec une expérience dans la gestion
                    de projets environnementaux et l'impact social à Madagascar.
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Stratégie environnementale</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Partenariats ONG</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Mesure d'impact</span>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105"
                  >
                    Postuler
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Call to action pour rejoindre l'équipe */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Vous partagez notre vision ?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Nous recherchons constamment des talents passionnés pour rejoindre notre mission.
                  Que vous soyez développeur, expert en durabilité, ou spécialiste en marketing,
                  votre expertise peut faire la différence.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:from-gray-900 hover:to-black transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Rejoindre l'aventure
                  <Users className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Section moderne */}
      <section className="py-24 relative overflow-hidden">
        {/* Background avec gradient animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-700 to-green-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Formes animées */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-300/15 rounded-full blur-lg animate-ping"></div>

        <div className="relative container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Rejoignez le mouvement</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Construisons Ensemble
              <span className="block text-transparent bg-gradient-to-r from-green-200 to-emerald-300 bg-clip-text">
                Un Madagascar Durable
              </span>
            </h2>

            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-12 max-w-3xl mx-auto">
              Chaque geste compte. Chaque matériau réutilisé fait la différence.
              Rejoignez GreenTech Marketplace et transformez votre impact environnemental.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Créer mon compte gratuit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 border-2 border-white/50 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                Nous contacter
                <Target className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 