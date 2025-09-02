import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("access_token") || null;
    const isAuthenticated = !!token;

    const loginUrl = new URL("/login", request.url);

    // Nếu chưa login và đang truy cập trang cần bảo vệ
    if (!isAuthenticated && request.nextUrl.pathname !== "/login") {
        return NextResponse.redirect(loginUrl);
    }

    // Nếu đã login và đang ở trang login, redirect về home (tuỳ)
    if (isAuthenticated && request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Áp dụng middleware cho tất cả trừ:
        // - /api
        // - /_next/*
        // - /favicon.ico, /robots.txt, /sitemap.xml
        // - tất cả file tĩnh có đuôi mở rộng (png, jpg, jpeg, gif, svg, ico, webp, mp4, etc.)
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|mp4|webm|woff|woff2|ttf|eot)).*)",
    ],
};
