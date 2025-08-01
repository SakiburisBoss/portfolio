import { clerkMiddleware, currentUser } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_EMAIL = "iamsakibur@gmail.com";

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/uploads") ||
    /\.(svg|png|jpg|jpeg|gif|ico|css|js|webp)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  try {
    // Handle /me routes - Admin only
    if (pathname.startsWith("/me")) {
      const user = await currentUser();
      if (!user) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
      const isAdmin = user.emailAddresses.some(
        (e) => e.emailAddress === ADMIN_EMAIL
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
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
