import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/webhooks/clerk', 
  '/api/webhooks/stripe',
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/product(.*)',
  '/search(.*)',
  '/privacy-policy(.*)',
  '/termsAndServices(.*)',
  '/shipping-policy(.*)',
  '/account-delete-instruction(.*)',
  '/api/email/others',
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}