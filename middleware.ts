import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_EMAIL = [
  "iamsakibur@gmail.com",
  "iamsakiburr@gmail.com",
  "pulse69x@gmail.com",
  "codewithsakibur@gmail.com",
];

export default clerkMiddleware(
  async (auth, req: NextRequest) => {
    const { pathname } = req.nextUrl;

    // Skip middleware for static files
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/uploads") ||
      /\.(svg|png|jpg|jpeg|gif|ico|css|js|webp)$/i.test(pathname)
    ) {
      return NextResponse.next();
    }
    const hostname = req.headers.get("host") || "";
    const isSubdomain = hostname.includes(".") && !hostname.startsWith("www.");

    // For subdomains, allow iframe embedding
    if (isSubdomain || req.nextUrl.searchParams.has("embed")) {
      const response = NextResponse.next();
      response.headers.set("X-Frame-Options", "ALLOWALL");
      response.headers.set("Content-Security-Policy", "frame-ancestors *");
      return response;
    }

    try {
      // Handle /me routes - Admin only
      if (pathname.startsWith("/me")) {
        const { userId } = await auth();
        if (!userId) {
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }
        const user = (await clerkClient()).users.getUser(userId);
        const userEmails = (await user).emailAddresses.map(
          (e) => e.emailAddress
        );
        const isAdmin = userEmails.some((email) =>
          ADMIN_EMAIL.some(
            (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
          )
        );

        if (!isAdmin) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        return NextResponse.next();
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.redirect(new URL("/error", req.url));
    }
  },
  {
    // Clerk configuration for subdomain support
    domain: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
