import Link from 'next/link';

export default function AboutHome() {
  return (
    <div>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">À propos de GreenTech Marketplace</h2>
            <p className="text-gray-600 text-lg mb-8">
              GreenTech Marketplace est la première plateforme à Madagascar dédiée à la réutilisation de matériaux de construction et d'artisanat. Notre mission : faciliter l'économie circulaire, réduire les déchets et rendre les matériaux accessibles à tous.
            </p>
            <Link href="/about" className="inline-block px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 