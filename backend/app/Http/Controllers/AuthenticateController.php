<?php

namespace App\Http\Controllers;

use App\Enums\ErrorCode;
use App\Http\Requests\Authenticate\ChangePasswordRequest;
use App\Http\Requests\Authenticate\CheckOTPRequest;
use App\Http\Requests\Authenticate\ForgotPasswordRequest;
use App\Http\Requests\Authenticate\LoginRequest;
use App\Http\Requests\Authenticate\LogoutRequest;
use App\Http\Requests\Authenticate\RefreshRequest;
use App\Http\Requests\Authenticate\RegisterRequest;
use App\Http\Requests\Authenticate\ResetPasswordRequest;
use App\Http\Requests\Authenticate\VerifyEmailRequest;
use App\Http\Services\AuthenticateService;
use App\Http\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Knuckles\Scribe\Attributes\ResponseFromFile;

class AuthenticateController extends Controller
{
    public function __construct(protected AuthenticateService $authenticateService, protected CustomerService $customerService) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();
        $tokens = $this->authenticateService->login($data['email'], $data['password'], $data['device_name']);

        if ($tokens) {
            return $this->responseSuccess($tokens, 'Login successfully.')
                ->cookie('access_token', $tokens['access_token'], (int)config("sanctum.t_expiration") * 60, '/', null, true, true)
                ->cookie('refresh_token', $tokens['refresh_token'], (int)config("sanctum.rt_expiration") * 60, '/', null, true, true)
                ->withoutCookie('reset_password_token');
        } else {
            return $this->responseError(ErrorCode::INVALID_CREDENTIALS, Response::HTTP_UNAUTHORIZED);
        }
    }

    public function refresh(RefreshRequest $request): JsonResponse
    {
        $data = $request->validated();
        $tokens = $this->authenticateService->refreshToken($data['device_name']);
        if (!$tokens || !isset($tokens['access_token']) || !isset($tokens['refresh_token'])) {
            return $this->responseError(ErrorCode::INVALID_CREDENTIALS, Response::HTTP_UNAUTHORIZED)
                ->withoutCookie('access_token')
                ->withoutCookie('refresh_token')
                ->withoutCookie('reset_password_token');
        }
        return $this->responseSuccess($tokens, 'Refresh token successfully.')
            ->cookie('access_token', $tokens['access_token'], (int)config("sanctum.t_expiration") * 60, '/', null, true, true)
            ->cookie('refresh_token', $tokens['refresh_token'], (int)config("sanctum.rt_expiration") * 60, '/', null, true, true);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();
        try {
            $tokens = $this->authenticateService->register($data['email'], $data['password'], $data['device_name']);
            if ($tokens) {
                return $this->responseSuccess($tokens, 'Register successfully. Please check your email to verify your account.')
                    ->cookie('access_token', $tokens['access_token'], (int)config("sanctum.t_expiration") * 60, '/', null, true, true)
                    ->cookie('refresh_token', $tokens['refresh_token'], (int)config("sanctum.rt_expiration") * 60, '/', null, true, true)
                    ->withoutCookie('reset_password_token');;
            } else {
                return $this->responseError(ErrorCode::REGISTER_FAILED);
            }
        } catch (\Exception $e) {
            if ($e instanceof ErrorCode) {
                return $this->responseError($e);
            }
            return $this->responseError(ErrorCode::REGISTER_FAILED, Response::HTTP_BAD_REQUEST, $e->getMessage());
        }
    }

    public function verifyEmailRegister(VerifyEmailRequest $request): JsonResponse
    {
        $otpCode = $request->get('otp');
        $isVerified = $this->authenticateService->verifyEmailRegister($otpCode);

        return $this->responseSuccess([
            "is_valid" => $isVerified,
        ]);
    }

    public function resendVerifyEmail(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) goto end;
        $isSend = $this->authenticateService->resendVerifyEmail();
        if ($isSend) {
            return $this->responseSuccess(null, 'Resend email verification successfully.');
        }
        end:
        return $this->responseError(ErrorCode::RESEND_VERIFICATION_FAILED);
    }

    public function logout(LogoutRequest $request)
    {
        $user = Auth::user();
        $user->tokens()->where("device_name", $request->get("device_name"))->delete();
        return $this->responseSuccess(null, 'Logout successfully.')
            ->withoutCookie('access_token')
            ->withoutCookie('refresh_token');
    }

    public function checkIsUserVerified(): JsonResponse
    {
        $user = Auth::user();
        if ($user->hasVerifiedEmail()) {
            return $this->responseSuccess(["is_verified" => true,], 'Email is verified.');
        } else {
            return $this->responseSuccess(["is_verified" => false,], 'Email is not verified.');
        }
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $result = $this->authenticateService->changePassword(
            $request->input('old_password'),
            $request->input('new_password')
        );
        if ($result === true) {
            return $this->responseSuccess(null, 'Password changed successfully.');
        } elseif ($result instanceof ErrorCode) {
            return $this->responseError($result);
        } else {
            return $this->responseError(ErrorCode::DEFAULT);
        }
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $email = $request->input('email');
        $isSent = $this->authenticateService->sendMailForgotPassword($email);
        if ($isSent instanceof ErrorCode) return $this->responseError($isSent);
        return $this->responseSuccess(null, 'Reset password email sent successfully.');
    }

    public function verifyResetPasswordOTP(CheckOTPRequest $request): JsonResponse
    {
        $data = $request->validated();
        $resetPasswordToken = $this->authenticateService->verifyResetPasswordOTP($data['email'], $data['otp']);
        return $this->responseJson(['reset_password_token' => $resetPasswordToken])
            ->cookie('reset_password_token', $resetPasswordToken, (int)config("sanctum.t_expiration") * 60, '/', null, true, true)
            ->withoutCookie('access_token')
            ->withoutCookie('refresh_token');
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $data = $request->validated();
        $newPassword = $data['new_password'];

        $result = $this->authenticateService->resetPassword($newPassword);

        if ($result instanceof ErrorCode) {
            return $this->responseError($result);
        }

        return $this->responseSuccess(null, 'Password reset successfully.');
    }
}
