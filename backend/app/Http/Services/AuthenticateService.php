<?php

namespace App\Http\Services;

use App\Enums\ErrorCode;
use App\Exceptions\ApiException;
use App\Http\Ultils\Contants\AuthConstant;
use App\Http\Ultils\OTPGenerate;
use App\Mail\Auth\ForgotPassword;
use App\Mail\Auth\MailVerifyRegister;
use App\Models\UserCredentialModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class AuthenticateService
{
    public function __construct(protected CustomerService $customerService) {}

    public function login(string $email, string $password, string $deviceName): ?array
    {
        try {
            $user = UserCredentialModel::where('email', $email)->first();
            $isLoggedIn = $user && Hash::check($password, $user->password);

            if ($isLoggedIn) {
                [$accessToken, $refreshToken, $tokenExpiredAt] = $this->createTokens($user, $deviceName);
                return [
                    'access_token'      => $accessToken,
                    'refresh_token'     => $refreshToken,
                    'expired_at'        => $tokenExpiredAt,
                    'is_email_verified' => $user->email_verified_at !== null,
                ];
            }
            return null;
        } catch (\Exception $e) {
            Log::error("Login error: " . $e->getMessage());
            return null;
        }
    }

    public function refreshToken($deviceName): array
    {
        $user = Auth::user();
        [$accessToken, $refreshToken, $tokenExpiredAt] = $this->createTokens($user, $deviceName);

        return [
            'access_token'      => $accessToken,
            'refresh_token'     => $refreshToken,
            'expired_at'        => $tokenExpiredAt,
            'is_email_verified' => $user->email_verified_at !== null,
        ];
    }

    public function register($email, $password, $deviceName): ?array
    {
        DB::beginTransaction();
        try {
            $verifyExpireTime = now()->addMinutes(UserCredentialModel::VERIFY_EXPIRED_MINUTES);
            $otpCode = OTPGenerate::generate();
            Cache::put("verify_email_otp_code_{$email}", $otpCode, UserCredentialModel::VERIFY_EXPIRED_MINUTES * 60);

            $existUser = UserCredentialModel::where('email', $email)->first();
            if ($existUser && $existUser->email_verified_at) {
                throw new ApiException(ErrorCode::EMAIL_REGITERED);
            }

            $user = UserCredentialModel::updateOrCreate([
                'email' => $email
            ], [
                'password' => bcrypt($password),
                'verify_expire_at' => $verifyExpireTime,
            ]);

            if (!$existUser?->customerProfile()) {
                $this->customerService->createProfile(['user_credential_id' => $user->id]);
            }
            Mail::to($email)->send(new MailVerifyRegister($otpCode));
            DB::commit();

            [$accessToken, $refreshToken, $tokenExpiredAt] = $this->createTokens($user, $deviceName);
            return [
                'access_token'      => $accessToken,
                'refresh_token'     => $refreshToken,
                'expired_at'        => $tokenExpiredAt,
                'is_email_verified' => false,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Register error: " . $e->getMessage());
            throw $e;
        }
    }

    public function verifyEmailRegister($otpCode): bool
    {
        try {
            $user = Auth::user();
            if (!$user || !$user->verify_expire_at) return false;

            $isExpired = Carbon::now()->greaterThan($user->verify_expire_at);
            $currentOtpCode = Cache::get("verify_email_otp_code_{$user->email}");
            
            if (!$currentOtpCode) {
                Log::error("OTP code not found in cache for email: " . $user->email);
                return false;
            }

            $isMatch = hash_equals($currentOtpCode, $otpCode);
            if ($isExpired || !$isMatch) return false;

            $user->verify_expire_at = null;
            $user->email_verified_at = now();
            $user->save();
            return true;
        } catch (\Exception $e) {
            Log::error("Verify email error: " . $e->getMessage());
            return false;
        }
    }

    public function resendVerifyEmail(): bool
    {
        DB::beginTransaction();
        $user = Auth::user();
        try {
            $otpCode = OTPGenerate::generate();
            $verifyExpireTime = now()->addMinutes(UserCredentialModel::VERIFY_EXPIRED_MINUTES);
            Cache::put("verify_email_otp_code_{$user->email}", $otpCode, UserCredentialModel::VERIFY_EXPIRED_MINUTES * 60);

            $user->update(['verify_expire_at' => $verifyExpireTime]);

            Mail::to($user->email)->queue((new MailVerifyRegister($otpCode))->onQueue('mail'));
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Resend mail verification: " . $e->getMessage());
            return false;
        }
    }

    public function changePassword(string $oldPassword, string $newPassword): bool | ErrorCode
    {
        try {
            $user = Auth::user();
            $matchOldPW = password_verify($oldPassword, $user->password);
            if (!$matchOldPW) {
                Log::error("Old password is incorrect.", ['user_id' => $user->id]);
                return ErrorCode::OLD_PASSWORD_NOT_MATCH;
            }
            $user->password = bcrypt($newPassword);
            return $user->save();
        } catch (\Exception $e) {
            Log::error("Change password error: " . $e->getMessage(), [
                "line" => $e->getLine(),
                "file" => $e->getFile(),
            ]);
            return false;
        }
    }

    public function sendMailForgotPassword(string $email): bool | ErrorCode
    {
        try {
            $user = UserCredentialModel::where('email', $email)->first();
            if (!$user) {
                Log::error("User not found for email to send email reset password: " . $email);
                return ErrorCode::USER_NOT_FOUND;
            }

            if ($user->password_reset_token_expire_at) {
                $timeToExpired = Carbon::now()->diffInMinutes($user->password_reset_token_expire_at);
                $expiredTimeLimit = UserCredentialModel::PASSWORD_RESET_EXPIRED_MINUTES - 1;
                if ($timeToExpired > $expiredTimeLimit && $timeToExpired > 0) return ErrorCode::PASSWORD_RESET_MAIL_SENT;
            }

            $passwordResetToken = OTPGenerate::generate();
            $user->password_reset_token = bcrypt($passwordResetToken);
            $user->password_reset_token_expire_at = now()->addMinutes(UserCredentialModel::PASSWORD_RESET_EXPIRED_MINUTES);
            $user->save();

            Log::info("Send mail forgot password to: " . $email);
            Mail::to($email)->queue(new ForgotPassword($passwordResetToken));
            return true;
        } catch (\Exception $e) {
            Log::error("Send mail forgot password error: " . $e->getMessage());
            return false;
        }
    }

    public function verifyResetPasswordOTP(string $email, string $otp): ErrorCode | string
    {
        try {
            $user = UserCredentialModel::where("email", $email)->first();
            if (!$user) return false;

            if (!$user->password_reset_token || !$user->password_reset_token_expire_at) {
                Log::error("Password reset token or expiration time not set for user ID: " . $user->id);
                throw new ApiException(ErrorCode::INVALID_PASSWORD_RESET_TOKEN);
            }

            $isExpired = Carbon::now()->greaterThan($user->password_reset_token_expire_at);
            $isMatch = Hash::check($otp, $user->password_reset_token);
            if ($isExpired || !$isMatch) {
                throw new ApiException(ErrorCode::INVALID_PASSWORD_RESET_TOKEN);
            }

            $user->password_reset_token = null;
            $user->password_reset_token_expire_at = null;
            $user->save();

            $user->tokens()->where("name", 'refresh_token')->delete();
            $refreshPasswordToken = $user->createToken('refresh_token', [AuthConstant::ABILITY_RESET_PASSWORD], now()->addMinutes(config("sanctum.rt_expiration")));
            return $refreshPasswordToken->plainTextToken;
        } catch (\Exception $e) {
            Log::error("Check expired token error: " . $e->getMessage());
            throw $e;
        }
    }

    public function resetPassword(string $newPassword): bool | ErrorCode
    {
        try {
            $user = Auth::user();
            $user->password = bcrypt($newPassword);
            $user->tokens()->where("name", 'refresh_token')->delete();
            return $user->save();
        } catch (\Exception $e) {
            Log::error("Reset password error: " . $e->getMessage());
            return false;
        }
    }

    protected function checkForgotPasswordOTPMatch(UserCredentialModel $user, string $otp): bool
    {
        if (!$user->password_reset_token || !$user->password_reset_token_expire_at) {
            Log::error("Password reset token or expiration time not set for user ID: " . $user->id);
            return false;
        }
        $isExpired = Carbon::now()->greaterThan($user->password_reset_token_expire_at);
        $isMatch = Hash::check($otp, $user->password_reset_token);
        if ($isExpired || !$isMatch) {
            return false;
        }
        return true;
    }

    protected function createTokens(UserCredentialModel $user, string $deviceName)
    {
        $user->tokens()->where("device_name", $deviceName)->delete();
        $tokenExpiredAt = now()->addMinutes((int)config("sanctum.t_expiration"));

        $accessToken = $user->createToken('access_token', [AuthConstant::ABILITY_ACCESS_TOKEN], $tokenExpiredAt);
        $accessToken->accessToken->device_name = $deviceName;
        $accessToken->accessToken->save();

        $refreshToken = $user->createToken('refresh_token', [AuthConstant::ABILITY_REFRESH_TOKEN], now()->addMinutes(config("sanctum.rt_expiration")));
        $refreshToken->accessToken->device_name = $deviceName;
        $refreshToken->accessToken->save();

        return [$accessToken->plainTextToken, $refreshToken->plainTextToken, $tokenExpiredAt->getTimestamp()];
    }
}
