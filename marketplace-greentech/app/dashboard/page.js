'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Package, MessageSquare, Heart, Settings, Edit3, Camera } from 'lucide-react';

// Mock user data
const mockUser = {
  name: 'Rakoto Jean',
  email: 'rakoto.jean@example.com',
  location: 'Antananarivo',
  joinedDate: '15/01/2023',
  phone: '+261 34 00 000 00',
  avatar: null, // In production, this would be an image URL
  stats: {
    listingsActive: 5,
    listingsSold: 8,
    totalViews: 320,
    favoriteCount: 12,
    responseRate: 95,
  }
};

export default function DashboardPage() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    location: user.location,
    phone: user.phone,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      ...editForm
    }));
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">
            Gérez votre profil et vos annonces
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-green-700 p-6 text-white">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">Mon Profil</h2>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-white hover:text-green-100"
                  >
                    <Edit3 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={40} className="text-gray-400" />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700">
                      <Camera size={14} />
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600 text-sm">Membre depuis {user.joinedDate}</p>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editForm.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Localisation
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={editForm.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary flex-1"
                      >
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            name: user.name,
                            email: user.email,
                            location: user.location,
                            phone: user.phone,
                          });
                        }}
                        className="btn btn-outline flex-1"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Localisation</h4>
                      <p className="text-gray-900">{user.location}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Téléphone</h4>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                    
                    <div className="pt-4">
                      <Link href="/dashboard/settings" className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                        <Settings size={16} className="mr-2" />
                        Paramètres du compte
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Stats and Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Annonces actives</h3>
                  <Package className="text-green-600" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.stats.listingsActive}</p>
                <Link href="/dashboard/listings" className="text-green-600 hover:text-green-800 text-sm font-medium mt-2 inline-block">
                  Gérer mes annonces
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Vues totales</h3>
                  <svg className="text-blue-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.stats.totalViews}</p>
                <p className="text-gray-500 text-sm mt-2">Sur toutes vos annonces</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Taux de réponse</h3>
                  <MessageSquare className="text-purple-600" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.stats.responseRate}%</p>
                <Link href="/dashboard/messages" className="text-green-600 hover:text-green-800 text-sm font-medium mt-2 inline-block">
                  Voir mes messages
                </Link>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Actions rapides</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/listings/create" className="btn btn-primary flex items-center justify-center gap-2">
                  <Package size={18} />
                  <span>Déposer une nouvelle annonce</span>
                </Link>
                
                <Link href="/dashboard/messages" className="btn btn-outline flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  <span>Consulter mes messages</span>
                </Link>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Activité récente</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MessageSquare size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Nouveau message reçu sur votre annonce <span className="font-medium">"Briques de construction"</span></p>
                    <p className="text-gray-500 text-sm mt-1">Il y a 2 heures</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Heart size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Votre annonce <span className="font-medium">"Poutres en bois"</span> a été ajoutée aux favoris</p>
                    <p className="text-gray-500 text-sm mt-1">Hier</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Package size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Vous avez publié une nouvelle annonce <span className="font-medium">"Panneaux solaires usagés"</span></p>
                    <p className="text-gray-500 text-sm mt-1">Il y a 3 jours</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/dashboard/activity" className="text-green-600 hover:text-green-800 text-sm font-medium">
                  Voir toute l'activité
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 