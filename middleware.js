import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

export default authMiddleware({
  publicRoutes: ['/api/uploadthing'],

  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      // console.log('URL IS ', req.url);
      // if (!auth.userId && !auth.isPublicRoute) {
      //   return redirectToSignIn({ returnBackUrl: req.url });
      // }

      if (!auth.userId && !auth.isPublicRoute) {
        const returnBackUrl = req.url;
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const redirectTo = `${baseUrl}/sign-in?returnBackUrl=${encodeURIComponent(
          returnBackUrl
        )}`;
        return redirectToSignIn({ returnBackUrl: redirectTo });
      }
    }
  },
});
// https://discord-clone-uix5.onrender.com/invite/8611f06b-7604-4026-99a8-82b8df133b8d
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
