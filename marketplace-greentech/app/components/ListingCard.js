import { MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Helper to format price
const formatPrice = (listing) => {
  if (listing.price === 0 || listing.isFree) return "Gratuit";
  return new Intl.NumberFormat("fr-MG", { style: "currency", currency: "MGA" }).format(listing.price);
};

// Helper to format condition
const formatCondition = (condition) => {
  const conditionMap = {
    'new': 'Neuf',
    'like_new': 'Comme neuf',
    'good': 'Bon état',
    'fair': 'État moyen',
    'poor': 'Mauvais état'
  };
  return conditionMap[condition] || condition;
};

export default function ListingCard({ listing, viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <Link 
        href={`/listings/${listing.id}`}
        className="card hover:shadow-lg transition-shadow"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-auto sm:w-48 bg-gray-200">
            {listing.images && listing.images.length > 0 ? (
              <Image
                src={`http://localhost:8000/media/${listing.images[0].image}`}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500 text-xs">Pas d'image</span>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm">
              <span className="font-medium text-green-600">
                {formatPrice(listing)}
              </span>
            </div>
          </div>
          <div className="p-4 flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <h3 className="font-semibold text-lg">{listing.title}</h3>
            </div>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{listing.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {listing.category && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {listing.category.name}
                </span>
              )}
              {listing.condition && (
                <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                  {formatCondition(listing.condition)}
                </span>
              )}
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={14} className="mr-1" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar size={14} className="mr-1" />
                <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link 
      href={`/listings/${listing.id}`}
      className="card hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 w-full bg-gray-200">
        {listing.images && listing.images.length > 0 ? (
          <Image
            src={`http://localhost:8000/media/${listing.images[0].image}`}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-xs">Pas d'image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm">
          <span className="font-medium text-green-600">
            {formatPrice(listing)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{listing.title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{listing.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={14} className="mr-1" />
            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {listing.category && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              {listing.category.name}
            </span>
          )}
          {listing.condition && (
            <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
              {formatCondition(listing.condition)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}