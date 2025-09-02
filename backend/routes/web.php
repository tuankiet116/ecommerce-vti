<?php

use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\RedirectController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::get("admin/{any?}", function () {
    return view('admin.index');
})->where('any', '.*');

Route::get('/email/verify/{id}/{hash}', [AuthenticateController::class, "verifyEmail"])->name('verification.verify');
Route::get('/redirect-link' , [RedirectController::class, "redirectLink"])->name('redirect.link');
