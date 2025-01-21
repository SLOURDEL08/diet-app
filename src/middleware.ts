import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = [
  '/',  // Ajoutez explicitement la page d'accueil
  '/auth/login',
  '/auth/register',
  '/api/auth/login',
  '/api/auth/register',
  '/verify-email',
  '/verify-email/[token]'
];

export async function middleware(request: NextRequest) {
   const { pathname } = request.nextUrl;
   const token = request.cookies.get('auth-token')?.value;

   // Permettre l'accès aux routes publiques avec une logique plus flexible
   const isPublicRoute = publicRoutes.some(route => {
     if (route.includes('[token]')) {
       return pathname.startsWith('/verify-email/');
     }
     // Correspondance exacte pour la racine, préfixe pour les autres routes
     return route === '/' ? pathname === route : pathname.startsWith(route);
   });

   // Ressources statiques et routes publiques
   if (
     pathname.startsWith('/_next') || 
     pathname === '/favicon.ico' ||
     isPublicRoute
   ) {
     return NextResponse.next();
   }

   // Redirection si pas de token
   if (!token) {
     return NextResponse.redirect(new URL('/auth/login', request.url));
   }

   try {
     // Le reste de votre code reste identique...
   } catch (error) {
     console.error('Middleware error:', error);
     const response = NextResponse.redirect(new URL('/auth/login', request.url));
     response.cookies.delete('auth-token');
     return response;
   }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};