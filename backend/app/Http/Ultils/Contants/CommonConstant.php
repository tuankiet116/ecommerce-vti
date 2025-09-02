<?php
namespace App\Http\Ultils\Contants;
class CommonConstant
{
    public const DEFAULT_PAGE_SIZE = 10;
    public const MAX_PAGE_SIZE = 100;
    public const DEFAULT_SORT_BY = 'created_at';
    public const DEFAULT_SORT_ORDER = 'desc';

    public const DATE_FORMAT = 'Y-m-d H:i:s';
    public const DATE_FORMAT_DISPLAY = 'd/m/Y H:i:s';

    public const UPLOAD_MAX_SIZE = 2048; // in KB

    public const LIVE_SESSION_EXPIRED_TIME = 60 * 60 * 2; // 24 hours in seconds
}