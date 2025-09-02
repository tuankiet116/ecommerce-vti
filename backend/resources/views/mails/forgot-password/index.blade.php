<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Reset Your Password - Shopera</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
        <tr>
            <td style="padding: 30px;">
                <table width="600" align="center" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="background-color: #3b82f6; padding: 20px 30px;">
                            <h2 style="color: #ffffff; margin: 0;">🔐 Reset Your Password</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 16px; color: #111827;">Hi there,</p>

                            <p style="font-size: 15px; color: #374151;">
                                We received a request to reset your password for your <strong>Shopera</strong> account.
                            </p>

                            <p style="font-size: 16px; color: #374151; margin-bottom: 10px;">
                                Use the following OTP to reset your password:
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <div
                                    style="
                                        display: inline-block;
                                        background-color: #f3f4f6;
                                        color: #1f2937;
                                        font-size: 24px;
                                        font-weight: bold;
                                        letter-spacing: 4px;
                                        padding: 12px 24px;
                                        border-radius: 8px;
                                        font-family: monospace;
                                        border: 1px solid #d1d5db;
                                    ">
                                    {{ $otpCode }}
                                </div>
                            </div>


                            <p style="font-size: 14px; color: #6b7280;">
                                This link will expire in 10 minutes. If you didn’t request a password reset, no further action is needed.
                            </p>

                            <p style="font-size: 14px; color: #9ca3af; margin-top: 40px;">— The Shopera Team</p>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 20px;">
                    © {{ now()->year }} Shopera. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>

</html>
