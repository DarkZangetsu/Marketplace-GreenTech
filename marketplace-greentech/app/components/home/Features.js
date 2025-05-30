/* eslint-disable react/no-unescaped-entities */
import { Gift, PiggyBank, Recycle, ArrowRight } from 'lucide-react'
import React from 'react'

export default function Features() {
  return (
    <div>
      {/* Features Section - Modern Design */}
      <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-green-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        </div>

        <div className="relative container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-green-100 text-green-800 rounded-full text-xs lg:text-sm font-medium mb-4 lg:mb-6">
              <Recycle className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
              Processus Simple
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
              Comment ça
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> marche</span>
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              GreenTech Marketplace facilite l'échange de matériaux entre particuliers, artisans, et ONG à Madagascar.
              Un processus simple en 3 étapes pour transformer vos déchets en ressources.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">

            {/* Feature 1 - Donnez ou Vendez */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl lg:rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 lg:hover:-translate-y-3 text-center h-full flex flex-col">

                {/* Step Number */}
                <div className="absolute -top-3 left-6 lg:-top-4 lg:left-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold">
                  1
                </div>

                <div className="relative mb-4 lg:mb-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Gift className="text-white w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-4 h-4 lg:w-6 lg:h-6 bg-green-200 rounded-full animate-ping opacity-75"></div>
                </div>

                <h3 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Donnez ou Vendez</h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed flex-grow mb-4 lg:mb-6">
                  Publiez gratuitement vos annonces pour donner ou vendre à prix réduit vos matériaux inutilisés.
                </p>

                {/* Action Arrow */}
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Feature 2 - Réutilisez */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl lg:rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 lg:hover:-translate-y-3 text-center h-full flex flex-col">

                {/* Step Number */}
                <div className="absolute -top-3 left-6 lg:-top-4 lg:left-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold">
                  2
                </div>

                <div className="relative mb-4 lg:mb-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Recycle className="text-white w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-4 h-4 lg:w-6 lg:h-6 bg-blue-200 rounded-full animate-ping opacity-75"></div>
                </div>

                <h3 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Réutilisez</h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed flex-grow mb-4 lg:mb-6">
                  Trouvez des matériaux d'occasion pour vos projets de construction ou d'artisanat.
                </p>

                {/* Action Arrow */}
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Feature 3 - Économisez */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl lg:rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 lg:hover:-translate-y-3 text-center h-full flex flex-col">

                {/* Step Number */}
                <div className="absolute -top-3 left-6 lg:-top-4 lg:left-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold">
                  3
                </div>

                <div className="relative mb-4 lg:mb-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <PiggyBank className="text-white w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-4 h-4 lg:w-6 lg:h-6 bg-amber-200 rounded-full animate-ping opacity-75"></div>
                </div>

                <h3 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Économisez</h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed flex-grow mb-4 lg:mb-6">
                  Réduisez vos coûts tout en contribuant à l'économie circulaire et à la protection de l'environnement.
                </p>

                {/* Success Check */}
                <div className="flex justify-center">
                  <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 lg:mt-16">
            <div className="inline-flex items-center space-x-2 text-green-600 font-medium text-sm lg:text-base">
              <span>Prêt à commencer ?</span>
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
