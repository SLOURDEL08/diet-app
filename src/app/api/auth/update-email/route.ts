import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import { verifyJWT } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    
    // Vérifier le token en utilisant l'API cookies de Next.js
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer et valider l'email
    const body = await request.json();
    const email = body.email;

    console.log('Email reçu:', email);

    if (!email) {
      return NextResponse.json({ 
        error: 'Email requis' 
      }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ 
        error: 'Format d\'email invalide' 
      }, { status: 400 });
    }

    // Décoder le token
    const decoded = verifyJWT(token);
    
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      _id: { $ne: decoded.userId }
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Cet email est déjà utilisé' 
      }, { status: 400 });
    }

    // Mettre à jour l'email
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        email: email.toLowerCase(),
        emailVerified: false,
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ 
        error: 'Utilisateur non trouvé' 
      }, { status: 404 });
    }

    console.log('Mise à jour réussie pour l\'utilisateur:', user._id);

    return NextResponse.json({ 
      success: true,
      message: 'Email mis à jour avec succès',
      user: {
        email: user.email,
        emailVerified: user.emailVerified
      }
    });

  } catch (error) {
    console.error('Update email error:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la mise à jour de l\'email',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}