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
    
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      const decoded = await verifyJWT(token);
      if (!decoded || typeof decoded === 'string') {
        throw new Error('Token invalide');
      }
      decodedToken = decoded;
    } catch {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

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

    const verificationToken = randomBytes(32).toString('hex');
    
    try {
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
      await user.save();

      await sendVerificationEmail(user.email, verificationToken);

      return NextResponse.json({
        success: true,
        message: 'Email de vérification envoyé',
        email: user.email
      });
    } catch {
      // En cas d'erreur, on essaie de réinitialiser le token
      try {
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
      } catch {
        // Si la réinitialisation échoue, on log l'erreur mais on ne bloque pas
        console.error('Échec de la réinitialisation du token de vérification');
      }

      return NextResponse.json({
        error: 'Erreur lors de l\'envoi de l\'email'
      }, { status: 500 });
    }
  } catch {
    return NextResponse.json({
      error: 'Une erreur inattendue est survenue'
    }, { status: 500 });
  }
}