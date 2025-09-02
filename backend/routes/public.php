<?php

use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ShopController;

Route::prefix("shop")->group((function () {
    Route::get('profile/{shopId}', [ShopController::class, 'getPublicProfile']);
}));

Route::prefix("product")->group((function () {
    Route::get('{shopId}/list', [\App\Http\Controllers\ProductController::class, 'publicIndex']);
    Route::get('{shopId}/detail/{id}', [\App\Http\Controllers\ProductController::class, 'showPublic']);
}));

Route::prefix("collection")->group((function () {
    Route::get('list', [CollectionController::class, 'listPublicCollections']);
    Route::get('detail/{collectionId}', [CollectionController::class, 'getPublicCollectionById']);
}));
