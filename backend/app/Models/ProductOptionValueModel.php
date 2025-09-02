<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductOptionValueModel extends Model
{
    protected $table = 'product_option_values';
    protected $fillable = [
        'shop_id',
        'product_id',
        'product_option_id',
        'value',
    ];
}
