import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // If the request is for static assets, images, API routes, or Next.js internals, pass it through.
    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.startsWith('/static') ||
        request.nextUrl.pathname.match(/\.(.*)$/)
    ) {
        return NextResponse.next();
    }

    // Define paths that are always accessible
    const isPreviewPage = request.nextUrl.pathname === '/preview';
    const isMaintenancePage = request.nextUrl.pathname === '/maintenance';

    // Check for the access cookie
    const accessCookie = request.cookies.get('pengui-access');
    const isAuthorized = accessCookie?.value === 'true';

    // If authorized, and trying to access maintenance or preview page, reconsider?
    // Let them be.

    if (!isAuthorized) {
        // If not authorized and trying to access anything other than preview/maintenance, redirect to maintenance
        if (!isPreviewPage && !isMaintenancePage) {
            return NextResponse.redirect(new URL('/maintenance', request.url));
        }
    } else {
        // If authorized and trying to access maintenance page, maybe redirect to home? (UX improvement)
        if (isMaintenancePage) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Match all routes except standard static files
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|screenshot.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
