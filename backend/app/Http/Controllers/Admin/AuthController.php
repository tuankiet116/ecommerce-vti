<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * @hideFromAPIDocumentation
     */
    public function login(LoginRequest $request)
    {
        $loggedin = Auth::guard('admin')->attempt([
            'email' => $request->email,
            'password' => $request->password,
        ], true);

        if (!$loggedin) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        return response()->json([
            'message' => 'Login successful',
            'admin' => Auth::guard('admin')->user(),
        ]);
    }

    /**
     * @hideFromAPIDocumentation
     */
    public function logoutAdmin()
    {
        Auth::guard('admin')->logout();
        return response()->json(['message' => 'Logout successful']);
    }
}
