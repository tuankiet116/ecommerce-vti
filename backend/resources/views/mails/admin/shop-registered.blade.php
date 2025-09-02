<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>New Shop Registration - Shopera</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
        <tr>
            <td style="padding: 30px;">
                <table width="600" align="center" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="background-color: #4f46e5; padding: 20px 30px;">
                            <h2 style="color: #ffffff; margin: 0;">🛍️ New Shop Registration</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 16px; color: #111827;">Hello Admin,</p>

                            <p style="font-size: 15px; color: #374151;">
                                A new shop has just registered on <strong>Shopera</strong> and is awaiting your approval.
                            </p>

                            <table style="font-size: 14px; color: #374151; margin-top: 20px;">
                                <tr>
                                    <td><strong>Shop Name:</strong></td>
                                    <td>{{ $shop->shop_name }}</td>
                                </tr>
                                <tr>
                                    <td><strong>Bussiness name:</strong></td>
                                    <td>{{ $shop->bussiness_name }}</td>
                                </tr>
                                <tr>
                                    <td><strong>Owner:</strong></td>
                                    <td>{{ $shop->legal_person_full_name }}</td>
                                </tr>
                                <tr>
                                    <td><strong>Email:</strong></td>
                                    <td>{{ $shop->contact_person_email }}</td>
                                </tr>
                                <tr>
                                    <td><strong>Registered At:</strong></td>
                                    <td>{{ $shop->created_at->format('F j, Y, g:i a') }}</td>
                                </tr>
                            </table>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="{{ $adminUrl }}"
                                    style="display: inline-block; background-color: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                                    Review & Approve
                                </a>
                            </div>

                            <p style="font-size: 14px; color: #9ca3af; margin-top: 40px;">This is an automated message from Shopera.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
