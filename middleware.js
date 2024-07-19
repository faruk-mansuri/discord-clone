import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

export default authMiddleware({
  publicRoutes: ['/api/uploadthing'],

  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      console.log('URL', req.url);
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const redirectTo = `${baseUrl}/sign-in?returnBackUrl=${encodeURIComponent(
        req.url
      )}`;
      return redirectToSignIn({ returnBackUrl: redirectTo });
    }
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
