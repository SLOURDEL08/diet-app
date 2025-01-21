import jwt from 'jsonwebtoken';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt';
const SECRET = new TextEncoder().encode(JWT_SECRET);
const EXPIRATION = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Pour les API routes
export function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  if (!payload.userId || !payload.email) {
    throw new Error('Payload invalide: userId et email requis');
  }

  try {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: EXPIRATION,
      algorithm: 'HS256'
    });
  } catch (error) {
    console.error('JWT Signing error:', error);
    throw new Error('Erreur lors de la création du token');
  }
}

// Pour l'API routes
export function verifyJWT(token: string): JWTPayload {
  if (!token) {
    throw new Error('Token manquant');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      complete: true
    });

    // Vérification explicite du payload
    const payload = decoded.payload as JWTPayload;
    if (!payload.userId || !payload.email) {
      throw new Error('Token invalide: données manquantes');
    }

    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expiré');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token invalide');
    }
    console.error('JWT Verification error:', error);
    throw new Error('Erreur de vérification du token');
  }
}

// Pour le middleware (Edge Runtime)
export async function verifyJWTEdge(token: string): Promise<JWTPayload> {
  if (!token) {
    throw new Error('Token manquant');
  }

  try {
    const { payload } = await jose.jwtVerify(token, SECRET, {
      algorithms: ['HS256']
    });
    
    if (!payload.userId || !payload.email) {
      throw new Error('Token invalide: données manquantes');
    }

    // Vérification de l'expiration
    const exp = payload.exp;
    if (!exp || Date.now() >= exp * 1000) {
      throw new Error('Token expiré');
    }
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      iat: payload.iat,
      exp: payload.exp
    };
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      throw new Error('Token expiré');
    }
    if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
      throw new Error('Signature du token invalide');
    }
    console.error('JWT Edge Verification error:', error);
    throw new Error('Erreur de vérification du token Edge');
  }
}

// Fonction utilitaire pour vérifier si un token est expiré
export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string') return true;
    
    const payload = decoded.payload as { exp?: number };
    if (!payload.exp) return true;
    
    // Ajout d'une marge de sécurité de 1 seconde
    return Date.now() >= (payload.exp * 1000 - 1000);
  } catch (error) {
    console.error('Token expiration check error:', error);
    return true;
  }
}

// Fonction utilitaire pour décoder un token sans vérification (debug uniquement)
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string') return null;
    return decoded.payload as JWTPayload;
  } catch {
    return null;
  }
}