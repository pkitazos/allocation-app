import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Extract the headers from the request
  const guid = req.headers.get('DH75HDYT76');
  const displayName = req.headers.get('DH75HDYT77');
  const groups = req.headers.get('DH75HDYT78');

  // Log the headers to the console
  console.log('GUID:', guid);
  console.log('Display Name:', displayName);
  console.log('Groups:', groups);

  // Continue to the next middleware or the request handler
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Apply this middleware to all routes
};