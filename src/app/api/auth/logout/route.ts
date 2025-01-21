import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Créer une réponse
    const response = NextResponse.json(
      { message: 'Déconnexion réussie' },
      { status: 200 }
    );

    // Supprimer le cookie d'authentification
    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}