<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Shop Registration Rejected - Shopera</title>
</head>

<body style="margin: 0; padding: 0; background-color: #fef2f2;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
        <tr>
            <td style="padding: 30px;">
                <table width="600" align="center" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="background-color: #ef4444; padding: 20px 30px;">
                            <h2 style="color: #ffffff; margin: 0;">⚠️ Shop Registration Rejected</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 16px; color: #111827;">Hi {{ $shop->legal_person_full_name }},</p>

                            <p style="font-size: 15px; color: #374151;">
                                We're sorry to inform you that your registration for the shop <strong>{{ $shop->shop_name }}</strong> has not been approved at this
                                time.
                            </p>

                            <p style="font-size: 15px; color: #374151;">
                                If you believe this was a mistake or would like to update your information and reapply, please contact us.
                            </p>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="{{ $supportUrl ?? '#' }}"
                                    style="display: inline-block; background-color: #ef4444; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                                    Contact Support
                                </a>
                            </div>

                            <p style="font-size: 14px; color: #9ca3af; margin-top: 40px;">Thank you for your interest in Shopera.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
