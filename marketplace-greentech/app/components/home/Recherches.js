/* eslint-disable react/no-unescaped-entities */
import { Search } from 'lucide-react';
import React from 'react'

export default function Recherches() {
  return (
    <div>
      {/* Search Section */}
      <section className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-grow">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Que cherchez-vous?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Briques, bois, métal..."
                    className="input pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div className="w-full md:w-1/4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select id="category" className="input">
                  <option value="">Toutes les catégories</option>
                  {categoriesData?.categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <select id="location" className="input">
                  <option value="">Toute l'île</option>
                  <option value="Antananarivo">Antananarivo</option>
                  <option value="Tamatave">Tamatave</option>
                  <option value="Mahajanga">Mahajanga</option>
                  <option value="Fianarantsoa">Fianarantsoa</option>
                  <option value="Toliara">Toliara</option>
                </select>
              </div>
              <button className="btn btn-primary py-3">
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
