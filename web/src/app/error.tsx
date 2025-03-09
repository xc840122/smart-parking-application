'use client'

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

/**
 * Error boundry, for demo purpose, we just show the error message (not code)
 * @param param0 
 * @returns 
 */
const ErrorPage = (error: Error) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h1>
        <p className="text-lg text-gray-700 mb-4">{error.message}</p>
        <Button
          onClick={() => router.replace('/')}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;