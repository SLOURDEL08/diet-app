import { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';

interface PageProps {
  params: {
    token: string; // Il est attendu que 'token' soit une string résolue ici
  };
}

export default async function VerifyEmailPage({ params }: PageProps) {
  // Résoudre la promesse de 'params.token' (Next.js le fait pour toi)
  const token = await params.token; // Si 'token' est une promesse, on l'attend ici

  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailClient token={token} />
    </Suspense>
  );
}

function VerifyEmailLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Chargement...</h2>
        </div>
      </div>
    </div>
  );
}
