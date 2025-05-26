import Link from 'next/link';

export default function BadRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-yellow-600">400</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Requête invalide</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Désolé, la requête que vous avez effectuée n'est pas valide.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
} 