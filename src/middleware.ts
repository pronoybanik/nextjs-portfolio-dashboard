import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getCurrentUser } from "./service/auth";

const authRoutes = ["/login", "/register"];

// Only admin can access /dashboard/**
const roleBasedPrivateRoutes = {
  admin: [/^\/dashboard(\/.*)?$/],
};

type Role = keyof typeof roleBasedPrivateRoutes;



export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const userInfo = await getCurrentUser();

  console.log("user info", userInfo);

  // If user is NOT logged in
  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next(); 
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirectPath=${pathname}`, request.url)
      );
    }
  }

  // If logged in and trying to access /login or /register, redirect to dashboard
  if (authRoutes.includes(pathname)) {
    if (userInfo.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If user is admin and allowed to access the matched route
  const userRole = userInfo.role as Role;
  const allowedRoutes = roleBasedPrivateRoutes[userRole];

  if (
    allowedRoutes &&
    allowedRoutes.some((routeRegex) => routeRegex.test(pathname))
  ) {
    return NextResponse.next(); // Allow access
  }

  // Forbidden (user is logged in but does not have required role)
  return NextResponse.redirect(new URL("/", request.url));
};

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
