// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // If user is already logged in and trying to access /login → redirect to /dashboard
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Special handling for the root path "/"
    if (pathname === "/") {
      if (token) {
        // If logged in → go to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url))
      } else {
        // If not logged in → go to login
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        if (pathname === "/login" || pathname.startsWith("/api/auth")) {
          return true
        }

        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/((?!api/auth|_next|.*\\..*).*)"
  ]
}