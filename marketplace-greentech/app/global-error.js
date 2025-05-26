'use client';

export default function GlobalError({
  error,
  reset,
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center px-4">
            <h1 className="text-9xl font-bold text-red-600">500</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mt-4">Erreur critique</h2>
            <p className="text-gray-600 mt-2 mb-8">
              Une erreur critique s'est produite. Veuillez rafraîchir la page.
            </p>
            <button
              onClick={() => reset()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 