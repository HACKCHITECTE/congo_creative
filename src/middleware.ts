import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1];
      // On utilise la méthode standard pour décoder le base64
      const [user, pwd] = atob(authValue).split(':');

      const validUser = process.env.ADMIN_USER;
      const validPassword = process.env.ADMIN_PASSWORD;

      if (user === validUser && pwd === validPassword) {
        return NextResponse.next();
      }
    } catch (e) {
      console.error("Erreur de décodage Auth:", e);
    }
  }

  // Si on arrive ici, c'est que l'auth a échoué ou n'est pas présente
  return new NextResponse('Accès refusé. Espace réservé au Jury.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Zone Admin Congo Creative Index"',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*'], // Le middleware ne tourne QUE sur ces routes
};