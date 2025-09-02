<?php

namespace App\Enums;

enum ErrorCode: int
{
    case DEFAULT = 1;
    case EMAIL_UNVERIFIED = 1001;
    case REGISTER_FAILED = 1002;
    case INVALID_CREDENTIALS = 1003;
    case RESEND_VERIFICATION_FAILED = 1004;
    case EMAIL_REGITERED = 1005;
    case PROFILE_CREATION_FAILED = 1006;
    case PROFILE_NOT_FOUND = 1007;
    case PROFILE_DUPLICATE = 1008;
    case OLD_PASSWORD_NOT_MATCH = 1009;
    case USER_NOT_FOUND = 1010;
    case INVALID_PASSWORD_RESET_TOKEN = 1011;
    case PASSWORD_RESET_EXPIRED = 1012;
    case PASSWORD_RESET_MAIL_SENT = 1013;
    case PROFILE_UPDATE_FAILED = 1014;
    case NOT_FOUND = 1015;
    case LIVE_STREAM_STARTED = 1016;
    case LIVE_STREAM_TOKEN_GENERATE_FAILED = 1017;
    case LIVE_STREAM_NOT_STARTED = 1018;
    case LIVE_STREAM_IS_STREAMING = 1019;
    case SHOP_PROFILE_NOT_FOUND = 1020;
    case INVALID_LIVE_STREAM_MODERATOR = 1021;
    case DENY_LIVE_STREAM_MODERATOR = 1022;
    case CANNOT_RESTRICT_MODERATOR = 1023;
    case CANNOT_RESTRICT_HOST = 1024;
    case LIVE_STREAM_MODERATOR_ADD_FAILED = 1025;

    public function message(): string
    {
        return match($this) {
            self::DEFAULT => 'An error occurred.',
            self::EMAIL_UNVERIFIED => 'Email address is not verified.',
            self::REGISTER_FAILED => 'Registration failed. Please try again.',
            self::INVALID_CREDENTIALS => 'Invalid credentials provided.',
            self::RESEND_VERIFICATION_FAILED => 'Failed to resend verification email. Please try again.',
            self::EMAIL_REGITERED => 'The email is already registered.',
            self::PROFILE_CREATION_FAILED => 'Profile creation failed.',
            self::PROFILE_NOT_FOUND => 'Profile not found.',
            self::PROFILE_DUPLICATE => 'Profile already exists for this user.',
            self::OLD_PASSWORD_NOT_MATCH => 'The old password does not match.',
            self::USER_NOT_FOUND => 'User not found.',
            self::INVALID_PASSWORD_RESET_TOKEN => 'The password reset token is invalid or expired.',
            self::PASSWORD_RESET_EXPIRED => 'The password reset token has expired.',
            self::PASSWORD_RESET_MAIL_SENT => 'Password reset email has been sent. Wait 1 minute to resend.',
            self::PROFILE_UPDATE_FAILED => 'Profile update failed.',
            self::NOT_FOUND => 'Resource not found.',
            self::LIVE_STREAM_STARTED => 'Live stream has already started.',
            self::LIVE_STREAM_TOKEN_GENERATE_FAILED => 'Failed to generate live stream token. Please try again.',
            self::LIVE_STREAM_NOT_STARTED => 'Live stream has not started yet.',
            self::LIVE_STREAM_IS_STREAMING => 'Live stream is currently streaming.',
            self::SHOP_PROFILE_NOT_FOUND => 'Shop profile not found, please create a profile first.',
            self::INVALID_LIVE_STREAM_MODERATOR => 'Invalid live stream moderator.',
            self::DENY_LIVE_STREAM_MODERATOR => 'You are not allowed to modify this livestream session.',
            self::CANNOT_RESTRICT_MODERATOR => 'You cannot restrict a moderator.',
            self::CANNOT_RESTRICT_HOST => 'You cannot restrict the host of the live stream.',
            self::LIVE_STREAM_MODERATOR_ADD_FAILED => 'Failed to add live stream moderator. Please try again.',
        };
    }
}