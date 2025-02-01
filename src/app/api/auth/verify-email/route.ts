import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { User } from '@/models/User';
import { verifyJWT } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import { sendVerificationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export async function POST() {
  try {
    await connectDB();
    
    // Vérification du token d'authentification
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Décodage et vérification du token
    let decoded;
    try {
      decoded = await verifyJWT(token);
    } catch {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Recherche de l'utilisateur
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si un email a déjà été envoyé récemment
    const cooldownPeriod = 2 * 60 * 1000; // 2 minutes
    if (
      user.emailVerificationExpires &&
      Date.now() - user.emailVerificationExpires.getTime() < -cooldownPeriod
    ) {
      const timeLeft = Math.ceil(
        (user.emailVerificationExpires.getTime() - Date.now() - cooldownPeriod) / 1000 / 60
      );
      return NextResponse.json(
        {
          error: `Veuillez attendre ${timeLeft} minute(s) avant de demander un nouveau code`
        },
        { status: 429 }
      );
    }

    // Générer un nouveau token de vérification
    const verificationToken = randomBytes(32).toString('hex');
    
    // Mettre à jour l'utilisateur
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await user.save();

    try {
      // Envoyer l'email
      await sendVerificationEmail(user.email, verificationToken);

      return NextResponse.json({
        success: true,
        message: 'Email de vérification envoyé',
        email: user.email
      });
    } catch (error) {
      // En cas d'erreur d'envoi, réinitialiser le token
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      return NextResponse.json({
        error: 'Erreur lors de l\'envoi de l\'email'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Erreur serveur'
    }, { status: 500 });
  }
}