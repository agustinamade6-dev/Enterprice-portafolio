import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public paths that should not be protected
  if (
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/api/auth/')
  ) {
    return NextResponse.next()
  }

  const session = await getSession()

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = new URL('/admin/login', request.url)
      // Save original URL to redirect back after login
      if (pathname !== '/admin') {
        url.searchParams.set('callbackUrl', encodeURI(pathname))
      }
      return NextResponse.redirect(url)
    }
  }

  // Protect /api/content routes (CRUD operations)
  if (pathname.startsWith('/api/content') || pathname.startsWith('/api/media')) {
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/content/:path*',
    '/api/media/:path*'
  ],
}
