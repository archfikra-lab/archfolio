import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const authMiddleware = withAuth(
    function onSuccess(req) {
        return intlMiddleware(req);
    },
    {
        callbacks: {
            authorized: ({ token }) => token != null
        },
        pages: {
            signIn: '/login' // Maps to /[locale]/login inherently via intlMiddleware handling later
        },
        secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_only",
    }
);

export default function middleware(req: NextRequest) {
    const protectedPaths = ['/admin', '/author', '/expert', '/academic'];
    const isProtectedPath = protectedPaths.some((path) =>
        req.nextUrl.pathname.includes(path)
    );

    if (isProtectedPath) {
        return (authMiddleware as any)(req);
    } else {
        return intlMiddleware(req);
    }
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
