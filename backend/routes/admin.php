<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ShopController;

/**
 * @hideFromAPIDocumentation
 */
Route::get("check-auth", fn() => response()->json(['loggedin' => auth("admin")->check()]));
Route::post("login", [AuthController::class, "login"]);
Route::middleware(['auth:admin'])->group((function () {
    Route::post("logout", [AuthController::class, "logoutAdmin"]);
    Route::prefix("shop")->group(function () {
        Route::get("list", [ShopController::class, "getList"]);
        Route::get("detail/{id}", [ShopController::class, "getDetail"]);
        Route::put("status/{id}", [ShopController::class, "updateStatus"]);
        Route::post("update/{id}", [ShopController::class, "updateProfile"]);
        Route::post("delete/{id}", [ShopController::class, "deleteShop"]);
    });

    Route::prefix("category")->group(function() {
        Route::get("list", [CategoryController::class, "index"]);
        Route::post("create", [CategoryController::class, "create"]);
        Route::put("update/{id}", [CategoryController::class, "update"]);
        Route::delete("delete/{id}", [CategoryController::class, "delete"]);
    });
}));