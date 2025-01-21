import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { User } from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJWT(token);

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      onboardingCompleted: user.onboardingCompleted,
      currentStep: user.onboardingStep,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}