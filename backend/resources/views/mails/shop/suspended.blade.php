<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your Shop Has Been Suspended - Shopera</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fff7ed;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
        <tr>
            <td style="padding: 30px;">
                <table align="center" width="600" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">
                    <tr>
                        <td style="background-color: #f97316; padding: 20px 30px;">
                            <h2 style="color: #ffffff; margin: 0;">⚠️ Shop Suspended</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p>Hello {{ $shop->contact_person_name ?? 'Merchant' }},</p>

                            <p>We want to inform you that your shop <strong>{{ $shop->shop_name }}</strong> has been temporarily suspended.</p>
                            <p>If you need further clarification or believe this was an error, feel free to contact our support team.</p>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{ $supportUrl ?? "#" }}" style="background-color: #f97316; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    Contact Support
                                </a>
                            </div>

                            <p style="color: #6b7280;">We’re here to help,</p>
                            <p style="color: #6b7280;">— The Shopera Team</p>
                        </td>
                    </tr>
                </table>
                <p style="text-align: center; color: #9ca3af; font-size: 12px;">© {{ now()->year }} Shopera. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
