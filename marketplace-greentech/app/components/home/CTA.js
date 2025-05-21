/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import React from 'react'

export default function CTA() {
  return (
    <div>
       {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à contribuer à l'économie circulaire?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez GreenTech Marketplace aujourd'hui et commencez à donner une seconde vie aux matériaux.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn bg-white text-green-700 hover:bg-gray-100">
              Créer un compte
            </Link>
            <Link href="/listings/create" className="btn bg-green-600 border border-white hover:bg-green-800">
              Déposer une annonce
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
