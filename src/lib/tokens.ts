// lib/tokens.ts
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { User } from '@/models/User';

const TOKEN_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

interface VerificationTokenPayload {
  userId: string;
  email: string;
  type: 'email-verification';
  code: string;
}

export async function createVerificationToken(email: string): Promise<string> {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  const payload: VerificationTokenPayload = {
    userId: user._id.toString(),
    email,
    type: 'email-verification',
    code: nanoid(32), // Génère un code unique
  };

  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export async function verifyEmailToken(token: string) {
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET) as VerificationTokenPayload;
    
    if (decoded.type !== 'email-verification') {
      throw new Error('Type de token invalide');
    }

    const user = await User.findById(decoded.userId);
    
    if (!user || user.email !== decoded.email) {
      throw new Error('Utilisateur non trouvé ou email non correspondant');
    }

    // Mettre à jour l'utilisateur
    await User.findByIdAndUpdate(decoded.userId, {
      emailVerified: true,
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return false;
  }
}