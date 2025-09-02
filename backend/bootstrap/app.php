<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')->prefix('api/admin')->group(base_path('routes/admin.php'));
            Route::middleware('api')->prefix('api/public')->group(base_path('routes/public.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'abilities' => CheckAbilities::class,
            'ability' => CheckForAnyAbility::class,
            'has-shop' => App\Http\Middleware\EnsureUserHasShop::class,
        ]);

        $middleware->append([
            App\Http\Middleware\ForceJsonResponse::class,
            App\Http\Middleware\InjectBearerTokenFromCookie::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->report(function (Exception $e) {
            $context = [
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'message' => $e->getMessage(),
            ];
            Log::error('Exception occurred', $context);
        });

        $exceptions->render(function (AuthenticationException $e, $request) {

            // Nếu là refresh token route
            if ($request->routeIs('refresh_token')) {
                return response()->json(['message' => 'Unauthenticated.'], 401)
                    ->withoutCookie('refresh_token')
                    ->withoutCookie('access_token');
            }

            // Nếu là API bình thường
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401)->withoutCookie('access_token');
            }
        });
    })->create();
