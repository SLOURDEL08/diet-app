'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export default function VerifyEmailClient({ token }: { token: string }) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string>('');


useEffect(() => {
  if (!token) {
    setStatus('error');
    setError('Aucun token de vérification fourni');
    return;
  }
  
  const verifyEmail = async () => {
    try {
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        
        // Informer la fenêtre parente
        if (window.opener) {
          // Seulement envoyer le message, pas de localStorage
          window.opener.postMessage('emailVerified', window.location.origin);
          // Fermer automatiquement après le succès
          setTimeout(() => window.close(), 3000);
        } else {
          // Si pas de fenêtre parente, afficher juste le message de succès
          // sans redirection
          setStatus('success');
        }
      } else {
        throw new Error(data.error || 'Le lien de vérification est invalide ou a expiré');
      }
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la vérification');
    }
  };

  verifyEmail();
}, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center justify-center">
          {status === 'verifying' && (
            <div className="flex flex-col items-center">
              <Loader className="w-16 h-16 mb-4 text-indigo-600 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900">Vérification en cours...</h2>
              <p className="mt-2 text-gray-600 text-center">
                Nous vérifions votre lien de confirmation d'email.
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
              <h2 className="text-2xl font-bold text-green-600">Email vérifié</h2>
              <p className="mt-2 text-gray-600 text-center">
                Votre email a été confirmé avec succès.
              </p>
              <button
                onClick={() => window.close()}
                className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Fermer
              </button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center">
              <XCircle className="w-16 h-16 mb-4 text-red-500" />
              <h2 className="text-2xl font-bold text-red-600">Échec de vérification</h2>
              <p className="mt-2 text-gray-600 text-center">{error}</p>
              <button
                onClick={() => window.close()}
                className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}