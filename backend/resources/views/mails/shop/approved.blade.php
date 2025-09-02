<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Your Shop is Approved - Shopera</title>
</head>

<body style="margin: 0; padding: 0; background-color: #ecf0f3;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
        <tr>
            <td style="padding: 30px;">
                <table width="600" align="center" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="background-color: #22c55e; padding: 20px 30px;">
                            <h2 style="color: #ffffff; margin: 0;">🎉 Your Shop Has Been Approved!</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 16px; color: #111827;">Hi {{ $shop->legal_person_full_name }},</p>

                            <p style="font-size: 15px; color: #374151;">
                                Great news! Your shop <strong>{{ $shop->shop_name }}</strong> has been approved on <strong>Shopera</strong> and is now live.
                            </p>

                            <p style="font-size: 15px; color: #374151;">
                                You can now log in to your dashboard, manage your products, and start selling.
                            </p>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="{{ $dashboardUrl }}"
                                    style="display: inline-block; background-color: #22c55e; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                                    Go to Dashboard
                                </a>
                            </div>

                            <p style="font-size: 14px; color: #9ca3af; margin-top: 40px;">Welcome aboard and happy selling!</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
