/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import React from 'react'
import { ArrowRight, Users, Plus, Sparkles } from 'lucide-react'

export default function CTA() {
  return (
    <div>
      {/* CTA Section - Modern Design */}
      <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 lg:w-72 lg:h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-72 lg:h-72 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-teal-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px] md:bg-[size:50px_50px]"></div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs lg:text-sm font-medium mb-6 lg:mb-8">
              <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
              Rejoignez la Révolution Verte
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 lg:mb-8 leading-tight">
              Prêt à contribuer à
              <span className="block bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
                l'économie circulaire?
              </span>
            </h2>

            <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-green-100 mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
              Rejoignez GreenTech Marketplace aujourd'hui et commencez à donner une seconde vie aux matériaux.
              Ensemble, construisons un avenir plus durable pour Madagascar.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8 mb-8 lg:mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1 lg:mb-2">500+</div>
                <div className="text-green-200 text-xs lg:text-sm">Matériaux sauvés</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1 lg:mb-2">200+</div>
                <div className="text-green-200 text-xs lg:text-sm">Membres actifs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1 lg:mb-2">50+</div>
                <div className="text-green-200 text-xs lg:text-sm">Villes couvertes</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center">
              <Link href="/auth/register" className="group relative inline-flex items-center justify-center px-6 py-3 lg:px-8 lg:py-4 bg-white text-green-700 font-semibold rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px]">
                <Users className="mr-2 w-4 h-4 lg:w-5 lg:h-5" />
                <span>Créer un compte</span>
                <ArrowRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link href="/listings/create" className="group relative inline-flex items-center justify-center px-6 py-3 lg:px-8 lg:py-4 bg-transparent text-white font-semibold rounded-xl lg:rounded-2xl border-2 border-white/50 hover:border-white hover:bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px]">
                <Plus className="mr-2 w-4 h-4 lg:w-5 lg:h-5" />
                <span>Déposer une annonce</span>
                <ArrowRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8 mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-white/20">
              <div className="flex items-center space-x-2 text-green-200">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs lg:text-sm">Plateforme 100% gratuite</span>
              </div>
              <div className="flex items-center space-x-2 text-green-200">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs lg:text-sm">Transactions sécurisées</span>
              </div>
              <div className="flex items-center space-x-2 text-green-200">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-teal-400 rounded-full animate-pulse"></div>
                <span className="text-xs lg:text-sm">Support communautaire</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
