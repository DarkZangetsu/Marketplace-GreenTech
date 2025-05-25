import Image from 'next/image';

const testimonials = [
  {
    name: 'Jean Rakoto',
    role: 'Artisan à Antananarivo',
    image: '/img/testimonials/jean.jpg',
    message: "Grâce à GreenTech, j'ai pu trouver des matériaux de qualité à petit prix pour mon atelier. La plateforme est simple et efficace !"
  },
  {
    name: 'ONG MadaRecyclage',
    role: 'Organisation environnementale',
    image: '/img/testimonials/ong.jpg',
    message: "Nous avons pu donner une seconde vie à des tonnes de matériaux grâce à la communauté. Un vrai plus pour l'économie circulaire à Madagascar."
  },
  {
    name: 'Sophie Randria',
    role: 'Particulier, Fianarantsoa',
    image: '/img/testimonials/sophie.jpg',
    message: "J'ai vendu mes briques inutilisées en quelques jours. C'est rassurant de savoir qu'elles serviront à d'autres projets !"
  }
];

export default function Testimonials() {
  return (
    <div>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ils témoignent</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez comment GreenTech Marketplace aide particuliers, artisans et ONG à Madagascar.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="w-20 h-20 mb-4 relative rounded-full overflow-hidden border-4 border-green-100">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{t.name}</h3>
                <p className="text-green-700 text-sm mb-3">{t.role}</p>
                <p className="text-gray-700 italic">“{t.message}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 