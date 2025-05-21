/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import React from 'react'

export default function Hero() {
  return (
    <div>
       {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Donnez une seconde vie aux matériaux
              </h1>
              <p className="text-lg md:text-xl mb-6">
                Plateforme de réutilisation de matériaux de construction et d'artisanat à Madagascar.
                Donnez, récupérez ou achetez à prix réduit des matériaux encore utilisables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/listings" className="btn btn-accent">
                  Voir les annonces
                </Link>
                <Link href="/auth/register" className="btn bg-white text-green-700 hover:bg-gray-100">
                  Créer un compte
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gray-900 opacity-20 z-10 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/90 p-6 rounded-lg shadow-lg max-w-sm">
                    <h3 className="text-green-700 font-semibold text-xl mb-2">Réduisez les déchets</h3>
                    <p className="text-gray-700">Contribuez à l'économie circulaire en donnant une nouvelle vie aux matériaux inutilisés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
