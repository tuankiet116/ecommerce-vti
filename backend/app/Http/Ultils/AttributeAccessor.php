<?php

namespace App\Http\Ultils;

use Illuminate\Support\Facades\Storage;

class AttributeAccessor
{
    public static function getImageUrl($imagePath)
    {
        if (empty($imagePath)) {
            return null;
        }
        return asset(Storage::url($imagePath));
    }
}
