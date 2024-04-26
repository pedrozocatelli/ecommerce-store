import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic',
      },
    });
  }
}

async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get('authorization') || req.headers.get('Authorization');

  if (authHeader == null) return Promise.resolve(false);

  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');

  console.log(username, password);
  return Promise.resolve(true);
}

export const config = {
  matcher: '/admin/:path*',
};
