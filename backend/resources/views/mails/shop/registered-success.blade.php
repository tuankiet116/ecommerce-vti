<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Registration Pending - Shopera</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
        <tr>
            <td style="padding: 30px;">
                <table width="600" align="center" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="background-color: #10b981; padding: 20px 30px;">
                            <h2 style="color: #ffffff; margin: 0;">👋 Welcome to Shopera!</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 16px; color: #111827;">Hi {{ $shop->legal_person_full_name }},</p>
                            

                            <p style="font-size: 15px; color: #374151;">
                                Thank you for registering your shop <strong>{{ $shop->shop_name }}</strong> with Shopera!
                            </p>

                            <p style="font-size: 15px; color: #374151;">
                                Our team is reviewing your application. We’ll notify you as soon as your shop is approved. If we need any further information,
                                we’ll reach out directly to you.
                            </p>

                            <p style="font-size: 15px; color: #374151;">
                                We're excited to have you on board and look forward to helping your business grow.
                            </p>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="#"
                                    style="display: inline-block; background-color: #10b981; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                                    Contact Support
                                </a>
                            </div>

                            <p style="font-size: 14px; color: #9ca3af; margin-top: 40px;">Need help? Reach out to us anytime.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
