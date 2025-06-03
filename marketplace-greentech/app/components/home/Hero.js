/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import React from 'react'
import { ArrowRight, Recycle, Users, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <div>
      {/* Hero Section - Modern Design */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-10 w-32 h-32 md:w-48 md:h-48 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-4 left-20 w-32 h-32 md:w-48 md:h-48 bg-green-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh] lg:min-h-[80vh]">

            {/* Content Section - 50% */}
            <div className="space-y-6 lg:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs lg:text-sm font-medium">
                <Recycle className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                Économie Circulaire
              </div>

              {/* Main Heading */}
              <div className="space-y-4 lg:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Donnez une
                  <span className="block text-green-200"> seconde vie</span>
                  aux matériaux
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-green-100 leading-relaxed max-w-2xl">
                  Plateforme de réutilisation de matériaux de construction et d'artisanat à Madagascar.
                  Donnez, récupérez ou achetez à prix réduit des matériaux encore utilisables.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <Link href="/listings" className="group relative inline-flex items-center justify-center px-6 py-3 lg:px-8 lg:py-4 bg-white text-green-700 font-semibold rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  <span>Voir les annonces</span>
                  <ArrowRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link href="/auth/register" className="group relative inline-flex items-center justify-center px-6 py-3 lg:px-8 lg:py-4 bg-transparent text-white font-semibold rounded-xl lg:rounded-2xl border-2 border-white/50 hover:border-white hover:bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  <Users className="mr-2 w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Créer un compte</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 pt-4 lg:pt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-xs lg:text-sm text-green-200">Plateforme sécurisée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-300" />
                  <span className="text-xs lg:text-sm text-green-200">Transactions rapides</span>
                </div>
              </div>
            </div>

            {/* Illustration Section - 50% */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[700px] w-full">
                {/* Placeholder for illustration image */}
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                  <img
                    src="/images/illustration.png"
                    alt="Illustration sur la réutilisation de matériaux"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Cards - Hidden on small screens */}
                <div className="hidden lg:block absolute -top-4 -left-4 xl:-top-6 xl:-left-6 bg-white/90 backdrop-blur-sm p-3 xl:p-4 rounded-xl xl:rounded-2xl shadow-xl border border-white/50">
                  <div className="flex items-center space-x-2 xl:space-x-3">
                    <div className="w-8 h-8 xl:w-10 xl:h-10 bg-green-100 rounded-lg xl:rounded-xl flex items-center justify-center">
                      <Recycle className="w-4 h-4 xl:w-5 xl:h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs xl:text-sm font-semibold text-gray-900">Matériaux sauvés</div>
                      <div className="text-xs text-gray-600">+15% cette semaine</div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block absolute -bottom-4 -right-4 xl:-bottom-6 xl:-right-6 bg-white/90 backdrop-blur-sm p-3 xl:p-4 rounded-xl xl:rounded-2xl shadow-xl border border-white/50">
                  <div className="flex items-center space-x-2 xl:space-x-3">
                    <div className="w-8 h-8 xl:w-10 xl:h-10 bg-emerald-100 rounded-lg xl:rounded-xl flex items-center justify-center">
                      <Users className="w-4 h-4 xl:w-5 xl:h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs xl:text-sm font-semibold text-gray-900">Communauté active</div>
                      <div className="text-xs text-gray-600">200+ membres</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden lg:block absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-5 h-8 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
