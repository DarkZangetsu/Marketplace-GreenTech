import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-green-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page non trouvée</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
} 