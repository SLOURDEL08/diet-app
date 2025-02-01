import { NextResponse, type NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { User, OnboardingDataModel } from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    await connectDB();

    const data = await request.json();

    // Mise à jour des données d'onboarding
    const onboardingData = await OnboardingDataModel.findOneAndUpdate(
      { userId: decoded.userId },
      { 
        $set: {
          ...data,
          updatedAt: new Date(),
        }
      },
      { upsert: true, new: true }
    );

    // Mise à jour de l'étape d'onboarding de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
  decoded.userId,
  { 
    $set: {
      onboardingStep: data.currentStep,
      onboardingCompleted: data.currentStep >= 6 // Ajustez selon votre nombre d'étapes
    }
  },
  { new: true }
);

    return NextResponse.json({
      success: true,
      user: updatedUser,
      onboardingData
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'onboarding:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}