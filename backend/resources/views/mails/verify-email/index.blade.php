<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Welcome to Shopera - Verify Your Email</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
        <tr>
            <td style="padding: 30px;">
                <table width="600" align="center" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="background-color: #3b82f6; padding: 20px 30px;">
                            <h2 style="color: #ffffff; margin: 0;">🎉 Welcome to Shopera!</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 16px; color: #111827;">
                                Hi {{ $user->name ?? 'there' }},
                            </p>

                            <p style="font-size: 15px; color: #374151;">
                                Thank you for registering your shop on <strong>Shopera</strong>. To activate your account and complete the registration, please
                                enter the following OTP code:
                            </p>

                            <div style="text-align: center; margin: 30px 24px;">
                                <div
                                    style="
                                    display: inline-block;
                                    background-color: #f3f4f6;
                                    color: #1f2937;
                                    font-size: 24px;
                                    font-weight: bold;
                                    letter-spacing: 6px;
                                    padding: 14px 28px;
                                    border-radius: 8px;
                                    font-family: monospace;
                                    border: 1px solid #d1d5db;
                                ">
                                    {{ $otpCode }}
                                </div>
                            </div>

                            <p style="font-size: 14px; color: #6b7280;">
                                This code is valid for the next <strong>10 minutes</strong>. If you did not sign up for Shopera, please ignore this email.
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
