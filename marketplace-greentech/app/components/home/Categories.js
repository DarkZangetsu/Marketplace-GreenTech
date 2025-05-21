import { GET_CATEGORIES } from '@/lib/graphql/queries';
import { Gift } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Categories() {

    const { data: categoriesData } = useQuery(GET_CATEGORIES);

    return (
        <div>
            {/* Categories */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Parcourir par catégorie</h2>

                    {categoriesData?.categories?.length ? (
                        <div className="flex flex-wrap justify-center gap-8">
                            {categoriesData.categories.map(category => (
                                <Link
                                    key={category.id}
                                    href={`/categories/${category.slug}`}
                                    className="bg-white rounded-2xl shadow p-8 w-64 text-center hover:shadow-lg transition-shadow flex flex-col items-center"
                                >
                                    <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-green-50">
                                        <Gift className="h-7 w-7 text-green-500" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                                    <p className="text-sm text-gray-500">Voir les annonces</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="bg-green-50 p-6 rounded-full mb-4 flex items-center justify-center">
                                <Gift className="h-12 w-12 text-green-400" />
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
