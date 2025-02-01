import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { User } from '@/models/User';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ verified: false }, { status: 401 });
    }

    // Vérification du token dans un try/catch séparé pour gérer spécifiquement les erreurs de token
    try {
      const decoded = await verifyJWT(token);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return NextResponse.json({ verified: false }, { status: 404 });
      }

      return NextResponse.json({ verified: user.emailVerified || false });
    } catch {
      // En cas d'erreur de vérification du token, retourner unauthorized
      return NextResponse.json({ verified: false }, { status: 401 });
    }
  } catch {
    // Pour toute autre erreur serveur
    return NextResponse.json(
      { 
        verified: false,
        error: 'Une erreur est survenue lors de la vérification'
      }, 
      { status: 500 }
    );
  }
}