<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModelImageModel extends Model
{
    protected $table = 'model_images';
    protected $fillable = [
        'shop_id',
        'image_uuid',
        'model_type',
        'model_id',
    ];
}
