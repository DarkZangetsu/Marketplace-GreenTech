'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, MessageSquare, Heart, Settings, Edit3, Camera } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '@/lib/graphql/mutations';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    location: '',
    phone: '',
  });

  // Get user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({
        name: `${parsedUser.firstName || ''} ${parsedUser.lastName || ''}`.trim(),
        email: parsedUser.email || '',
        location: parsedUser.location || '',
        phone: parsedUser.phoneNumber || '',
      });
    }
  }, [router]);

  // Update profile mutation
  const [updateProfile] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: (data) => {
      if (data.updateUserProfile.success) {
        // Update localStorage with new user data
        const updatedUser = data.updateUserProfile.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        toast.success('Profil mis à jour avec succès');
      } else {
        toast.error(data.updateUserProfile.message);
      }
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du profil');
      console.error('Update profile error:', error);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [firstName, ...lastNameParts] = editForm.name.split(' ');
    const lastName = lastNameParts.join(' ');

    await updateProfile({
      variables: {
        input: {
          firstName,
          lastName,
          email: editForm.email,
          phoneNumber: editForm.phone,
        }
      }
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.username} 
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
                  <h3 className="text-xl font-semibold text-gray-900">{user.username}</h3>
                  <p className="text-gray-600 text-sm">Membre depuis {new Date(user.createdAt).toLocaleDateString()}</p>
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
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
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
                            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                            email: user.email || '',
                            location: user.location || '',
                            phone: user.phoneNumber || '',
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
                      <h4 className="text-sm font-medium text-gray-500">Téléphone</h4>
                      <p className="text-gray-900">{user.phoneNumber || 'Non renseigné'}</p>
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
                <p className="text-3xl font-bold text-gray-900">{user.listings?.filter(l => l.status === 'active').length || 0}</p>
                <Link href="/dashboard/listings" className="text-green-600 hover:text-green-800 text-sm font-medium mt-2 inline-block">
                  Gérer mes annonces
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Messages non lus</h3>
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.received_messages?.filter(m => !m.is_read).length || 0}</p>
                <Link href="/dashboard/messages" className="text-green-600 hover:text-green-800 text-sm font-medium mt-2 inline-block">
                  Voir mes messages
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Favoris</h3>
                  <Heart className="text-red-600" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{user.favorites?.length || 0}</p>
                <Link href="/dashboard/favorites" className="text-green-600 hover:text-green-800 text-sm font-medium mt-2 inline-block">
                  Voir mes favoris
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
                {user.received_messages?.slice(0, 3).map((message) => (
                  <div key={message.id} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MessageSquare size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">
                        Nouveau message de <span className="font-medium">{message.sender.username}</span> sur votre annonce
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
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