import React from 'react'
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react'

export default function HeroContact() {
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

        <div className="relative container mx-auto px-4 pt-20 pb-12 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20">
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs lg:text-sm font-medium mb-6 lg:mb-8">
              <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
              Nous Contacter
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 lg:mb-8 leading-tight">
              Contactez-nous
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-green-100 mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
              Nous sommes là pour répondre à vos questions et vous aider dans votre démarche de réutilisation des matériaux.
              Notre équipe est disponible pour vous accompagner.
            </p>

            {/* Quick Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20">
                <Phone className="w-6 h-6 lg:w-8 lg:h-8 text-white mx-auto mb-2 lg:mb-3" />
                <div className="text-sm lg:text-base font-semibold text-white mb-1">Téléphone</div>
                <div className="text-xs lg:text-sm text-green-200">+261 34 31 720 81</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20">
                <Mail className="w-6 h-6 lg:w-8 lg:h-8 text-white mx-auto mb-2 lg:mb-3" />
                <div className="text-sm lg:text-base font-semibold text-white mb-1">Email</div>
                <div className="text-xs lg:text-sm text-green-200">contact@greentech.mg</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20">
                <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-white mx-auto mb-2 lg:mb-3" />
                <div className="text-sm lg:text-base font-semibold text-white mb-1">Adresse</div>
                <div className="text-xs lg:text-sm text-green-200">Fianarantsoa, Madagascar</div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2 text-green-200">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-300 rounded-full animate-pulse"></div>
                <span className="text-xs lg:text-sm">Réponse sous 24h</span>
              </div>
              <div className="flex items-center space-x-2 text-green-200">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-300 rounded-full animate-pulse"></div>
                <span className="text-xs lg:text-sm">Support gratuit</span>
              </div>
              <div className="flex items-center space-x-2 text-green-200">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-teal-300 rounded-full animate-pulse"></div>
                <span className="text-xs lg:text-sm">Équipe dédiée</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
