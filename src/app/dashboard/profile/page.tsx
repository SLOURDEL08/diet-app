'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function Profile() {
  const { data: session } = useSession();
  const { data: onboardingData, updateData } = useOnboardingStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profession: onboardingData.profession || '',
    interests: onboardingData.interests || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      updateData(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        {/* En-tête du profil */}
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Profil Utilisateur
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Informations personnelles et préférences
          </p>
        </div>

        {/* Contenu du profil */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profession
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) =>
                    setFormData({ ...formData, profession: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{session?.user?.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Profession</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {onboardingData.profession || 'Non spécifié'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Centres dintérêt
                </h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {onboardingData.interests?.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Modifier le profil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}