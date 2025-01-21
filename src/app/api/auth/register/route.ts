import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password, name } = await request.json();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer le nouvel utilisateur
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    return NextResponse.json({
      message: 'Inscription réussie',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}