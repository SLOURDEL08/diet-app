'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export default function EmailVerification() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      // Obtenir le token depuis l'URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setError('Aucun token de vérification fourni');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          // Uniquement envoyer le message à la fenêtre parente si elle existe
          if (window.opener) {
            window.opener.postMessage(
              { type: 'emailVerification', status: 'success' },
              window.location.origin
            );
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
  }, []);

  const handleClose = () => {
    if (window.opener) {
      window.close();
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="flex flex-col items-center">
            <Loader className="w-16 h-16 mb-4 text-indigo-600 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900">Vérification en cours...</h2>
            <p className="mt-2 text-gray-600 text-center">
              Nous vérifions votre lien de confirmation d&apos;email.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-green-600">Email vérifié</h2>
            <p className="mt-2 text-gray-600 text-center">
              Votre email a été confirmé avec succès.
            </p>
            {window.opener && (
              <button
                onClick={handleClose}
                className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md 
                  text-white bg-green-600 hover:bg-green-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Fermer cette fenêtre
              </button>
            )}
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-red-600">Échec de vérification</h2>
            <p className="mt-2 text-gray-600 text-center">{error}</p>
            {window.opener && (
              <button
                onClick={handleClose}
                className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md 
                  text-white bg-red-600 hover:bg-red-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Fermer cette fenêtre
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center justify-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}