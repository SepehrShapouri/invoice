import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get("better-auth.session_token")
    const { pathname } = request.nextUrl

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        if (!sessionToken) {
            const loginUrl = new URL("/login", request.url)
            loginUrl.searchParams.set("from", pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    // If there is a session token and user tries to access login/register
    if (sessionToken && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register"
    ]
} 