<?php 
namespace App\Http\Ultils\Contants;

class AuthConstant
{
    public const USER_ROLE = 'user';
    public const ADMIN_ROLE = 'admin';
    public const SHOP_ROLE = 'shop';

    public const ABILITY_ACCESS_TOKEN = 'access_token';
    public const ABILITY_REFRESH_TOKEN = 'refresh_token';
    public const ABILITY_RESET_PASSWORD = 'reset_password';

    public const USER_CREDENTIALS_TABLE = 'user_credentials';
}