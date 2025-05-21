import Image from 'next/image'
import React from 'react'
import { partners } from '../constants/Partenaire'

export default function Parteners() {
  return (
    <div>
       {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos partenaires</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des entreprises engagées pour une construction durable
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {partners.map(partner => (
              <div key={partner.id} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
                <p className="text-gray-600 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
