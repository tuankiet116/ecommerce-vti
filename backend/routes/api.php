<?php

use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\EmailVerified;
use App\Http\Ultils\Contants\AuthConstant;
use Illuminate\Support\Facades\Route;

$abilityAccessToken = AuthConstant::ABILITY_ACCESS_TOKEN;
$abilityRefeshToken = AuthConstant::ABILITY_REFRESH_TOKEN;

Route::post("/login", [AuthenticateController::class, "login"])->name("shop.login");
Route::post("/register", [AuthenticateController::class, "register"])->name("shop.register");

Route::prefix('forgot-password')->middleware("throttle:6,1")->group(function () {
    Route::post("/send-otp", [AuthenticateController::class, "forgotPassword"]);
    Route::post("/check-otp", [AuthenticateController::class, "verifyResetPasswordOTP"]);
    Route::post("/reset-password", [AuthenticateController::class, "resetPassword"])->middleware("ability:" . AuthConstant::ABILITY_RESET_PASSWORD);
});

Route::middleware(['auth:sanctum', 'throttle:6,1'])->group(function () use ($abilityRefeshToken, $abilityAccessToken) {
    Route::post('refresh-token', [AuthenticateController::class, 'refresh'])->middleware("ability:$abilityRefeshToken")->name("refresh_token");
    Route::post('resend-verification', [AuthenticateController::class, "resendVerifyEmail"])->middleware("ability:$abilityAccessToken")->name('verification.send');
    Route::post("verify-email", [AuthenticateController::class, "verifyEmailRegister"])->name("shop.verify-email");
});

Route::middleware(['auth:sanctum', "ability:$abilityAccessToken", EmailVerified::class])->group(function () {
    Route::get('is-verified', [AuthenticateController::class, 'checkIsUserVerified']);
    Route::post('logout', [AuthenticateController::class, 'logout']);
    Route::post("change-password", [AuthenticateController::class, 'changePassword']);
    Route::prefix("customer")->group((function () {
        Route::put('profile', [CustomerController::class, 'updateProfile']);
        Route::post('avatar', [CustomerController::class, 'updateAvatar']);
        Route::get('profile', [CustomerController::class, 'getProfile']);
    }));

    Route::prefix("shop")->group((function () {
        Route::post('profile', [ShopController::class, 'createProfile']);
        Route::get('profile', [ShopController::class, 'getProfile']);

        Route::middleware('has-shop')->group(function () {
            Route::put('profile', [ShopController::class, 'updateProfile']);
            Route::post('avatar', [ShopController::class, 'updateAvatar']);
        });
    }));

    Route::middleware('has-shop')->group(function () {
        Route::prefix("collection")->group(function () {
            Route::post('create', [CollectionController::class, 'create']);
            Route::get('list', [CollectionController::class, 'index']);
            Route::put('/update/{collectionId}', [CollectionController::class, 'update']);
            Route::delete('/delete/{collectionId}', [CollectionController::class, 'delete']);
            Route::get('/detail/{collectionId}', [CollectionController::class, 'show']);
        });

        Route::prefix("product")->group((function () {
            Route::get('statistics', [ProductController::class, 'statistics']);
            Route::get('list', [ProductController::class, 'index']);
            Route::get('detail/{id}', [ProductController::class, 'show']);
            Route::put('update/{id}', [ProductController::class, 'updateProduct']);
            Route::post('create', [ProductController::class, 'createProduct']);
            Route::delete('delete/{id}', [ProductController::class, 'deleteProduct']);
            Route::post('bulk-delete', [ProductController::class, 'bulkDeleteProducts']);
            Route::post('bulk-update-status', [ProductController::class, 'bulkUpdateStatus']);
            Route::prefix("{productId}/variants")->group(function() {
                Route::get('list', [ProductVariantController::class, 'getVariantsByProductId']);
                Route::get('show/{variantId}', [ProductVariantController::class, 'getVariantByProductId']);
                Route::put('update/{variantId}', [ProductVariantController::class, 'updateVariantByProductId']);
                Route::delete('delete/{variantId}', [ProductVariantController::class, 'deleteVariantByProductId']);
            });
        }));

        Route::prefix('variants')->group((function () {
            Route::get("list", [ProductVariantController::class, 'getVariants']);
            Route::post("bulk-update", [ProductVariantController::class, 'bulkUpdate']);
        }));

        Route::prefix('images')->group((function () {
            Route::post('upload', [ImageController::class, 'upload']);
            Route::delete('delete/{uuid}', [ImageController::class, 'delete']);
            Route::get('show/{uuid}', [ImageController::class, 'getImageByUUID']);
            Route::get('list', [ImageController::class, 'listImages']);
        }));

        Route::get('categories', [CategoryController::class, 'index']);
    });
});
