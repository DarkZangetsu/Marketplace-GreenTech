/* eslint-disable react/no-unescaped-entities */
import { Gift, PiggyBank, Recycle } from 'lucide-react'
import React from 'react'

export default function Features() {
  return (
    <div>
        
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              GreenTech Marketplace facilite l'échange de matériaux entre particuliers, artisans, et ONG à Madagascar.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Donnez ou Vendez</h3>
              <p className="text-gray-600">
                Publiez gratuitement vos annonces pour donner ou vendre à prix réduit vos matériaux inutilisés.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réutilisez</h3>
              <p className="text-gray-600">
                Trouvez des matériaux d'occasion pour vos projets de construction ou d'artisanat.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="text-amber-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Économisez</h3>
              <p className="text-gray-600">
                Réduisez vos coûts tout en contribuant à l'économie circulaire et à la protection de l'environnement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
