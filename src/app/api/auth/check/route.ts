// app/api/auth/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { User } from '@/models/User';
import connectDB from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 401, headers }
      );
    }

    const decoded = verifyJWT(token);

    if (!decoded.userId) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401, headers }
      );
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select(
      '_id email name onboardingStep onboardingCompleted emailVerified'
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404, headers }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        onboardingStep: user.onboardingStep,
        onboardingCompleted: user.onboardingCompleted,
        emailVerified: user.emailVerified
      }
    }, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Erreur de serveur interne' },
      { status: 500, headers }
    );
  }
}