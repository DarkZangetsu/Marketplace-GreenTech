'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MessagesRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing');
  
  useEffect(() => {
    // Redirect to the dashboard messages page
    // If there's a listing ID parameter, pass it along
    if (listingId) {
      router.push(`/dashboard/messages?listing=${listingId}`);
    } else {
      router.push('/dashboard/messages');
    }
  }, [router, listingId]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-pulse flex space-x-4 items-center">
          <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          <div className="h-4 w-4 bg-green-500 rounded-full"></div>
        </div>
        <p className="text-gray-600 mt-4">Redirection vers vos messages...</p>
      </div>
    </div>
  );
} 