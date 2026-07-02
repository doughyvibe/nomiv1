import { NextRequest, NextResponse } from "next/server";

import { resolveSurface } from "@/lib/host";
import {
  copyCookies,
  getMiddlewareUser,
  isPublicDashboardPath,
} from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const { surface, slug } = resolveSurface(host);
  const { pathname } = request.nextUrl;

  // ponytail: hide internal dev tools in production
  if (pathname.startsWith("/dev") && process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  if (surface === "dashboard") {
    let response: NextResponse;

    if (pathname.startsWith("/auth") || pathname === "/login") {
      response = NextResponse.next();
    } else {
      const url = request.nextUrl.clone();
      url.pathname =
        pathname === "/" ? "/dashboard" : `/dashboard${pathname}`;
      response = NextResponse.rewrite(url);
    }

    const { user, response: sessionResponse } = await getMiddlewareUser(
      request,
      response,
    );

    if (user && pathname === "/login") {
      const home = request.nextUrl.clone();
      home.pathname = "/";
      const redirect = NextResponse.redirect(home);
      copyCookies(sessionResponse, redirect);
      return redirect;
    }

    if (!user && !isPublicDashboardPath(pathname)) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      const redirect = NextResponse.redirect(login);
      copyCookies(sessionResponse, redirect);
      return redirect;
    }

    return sessionResponse;
  }

  if (surface === "storefront" && slug) {
    const url = request.nextUrl.clone();
    const suffix = pathname === "/" ? "" : pathname;
    url.pathname = `/s/${slug}${suffix}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
