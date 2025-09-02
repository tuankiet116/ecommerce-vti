<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Route;
use Symfony\Component\HttpFoundation\Response;

class InjectBearerTokenFromCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->bearerToken()) {
            return $next($request);
        }

        $path = $request->path();
        $isRefreshRoute = str_ends_with($path, 'refresh-token');

        $cookieName = $isRefreshRoute ? 'refresh_token' : 'access_token';
        if ($token = $request->cookie($cookieName)) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
