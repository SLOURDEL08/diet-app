// app/api/auth/verify-token/route.ts
import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token } = await req.json();

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}