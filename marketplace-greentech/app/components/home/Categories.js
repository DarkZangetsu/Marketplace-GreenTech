import { GET_CATEGORIES } from '@/lib/graphql/queries';
import { useQuery } from '@apollo/client';
import { Grid, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Categories() {
    // Récupération d'un nombre limité de catégories depuis GraphQL
    const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES, {
        variables: {
            limit: 4
        }
    });

    return (
        <div>
            {/* Categories */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">Parcourir par catégorie</h2>
                        <Link href="/categories" className="text-green-600 hover:text-green-700 flex items-center">
                            Voir tout <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>

                    {categoriesLoading ? (
                        // Affichage de placeholders pendant le chargement
                        <div className="flex flex-wrap justify-center gap-8">
                            {Array(4).fill(0).map((_, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow p-8 w-64 text-center animate-pulse">
                                    <div className="mb-3 mx-auto w-14 h-14 rounded-full bg-gray-200"></div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                </div>
                            ))}
                        </div>
                    ) : categoriesData?.categories?.length ? (
                        // Affichage des catégories avec l'icône Gift pour toutes
                        <div className="flex flex-wrap justify-center gap-8">
                            {categoriesData.categories.map(category => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="bg-white rounded-2xl shadow p-8 w-64 text-center hover:shadow-lg transition-shadow flex flex-col items-center"
                                >
                                    <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-green-50">
                                        {/* Nouvel icône Grid pour toutes les catégories */}
                                        <Grid className="h-7 w-7 text-green-500" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                                    <p className="text-sm text-gray-500">Voir les annonces</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        // Message affiché si aucune catégorie n'est disponible
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="bg-green-50 p-6 rounded-full mb-4 flex items-center justify-center">
                                <Grid className="h-12 w-12 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune catégorie disponible</h3>
                            <p className="text-gray-500">Les catégories seront bientôt disponibles.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}