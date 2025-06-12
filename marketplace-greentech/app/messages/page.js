'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_ME } from '@/lib/graphql/queries';

// Composant qui utilise useSearchParams
function MessagesRedirectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing');
  
  // Check if user is authenticated
  const { data: userData, loading } = useQuery(GET_ME, {
    errorPolicy: 'ignore'
  });
  
  useEffect(() => {
    if (loading) return; 
    
    if (!userData?.me) {
      // User not authenticated, redirect to login with return URL
      const returnUrl = `/messages${listingId ? `?listing=${listingId}` : ''}`;
      router.push(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }
    
    // User is authenticated, redirect to dashboard messages
    if (listingId) {
      router.push(`/dashboard/messages?listing=${listingId}`);
    } else {
      router.push('/dashboard/messages');
    }
  }, [router, listingId, userData, loading]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-pulse flex space-x-4 items-center">
          <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          <div className="h-4 w-4 bg-green-500 rounded-full"></div>
        </div>
        <p className="text-gray-600 mt-4">
          {loading ? 'Vérification de l\'authentification...' : 'Redirection vers vos messages...'}
        </p>
      </div>
    </div>
  );
}

// Composant principal avec Suspense boundary
export default function MessagesRedirectPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-pulse flex space-x-4 items-center">
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      </div>
    }>
      <MessagesRedirectPageContent />
    </Suspense>
  );
}