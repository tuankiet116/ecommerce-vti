<?php

namespace App\Http\Middleware;

use App\Enums\ErrorCode;
use App\Models\ShopModel;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasShop
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $shopProfile = auth()->user()?->shopProfile;
        if (!$shopProfile) {
            return response()->json([
                'code' => ErrorCode::PROFILE_NOT_FOUND,
                'message' => 'You need to create a shop first.'
            ], 403);
        }

        if ($shopProfile->status !== ShopModel::STATUS_ACTIVE) {
            return response()->json([
                'code' => ErrorCode::PROFILE_NOT_FOUND,
                'message' => 'Your shop is not active. Please contact support.'
            ], 403);
        }

        app()->singleton('my_shop_profile', function () use ($shopProfile) {
            return $shopProfile;
        });

        return $next($request);
    }
}
