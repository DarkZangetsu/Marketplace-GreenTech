'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-red-600">500</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Erreur serveur</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Désolé, une erreur inattendue s'est produite. Veuillez réessayer.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
} 