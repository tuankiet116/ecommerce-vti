<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariantOptionValueModel extends Model
{
    protected $table = 'product_variant_option_value';
    protected $fillable = [
        'shop_id',
        'product_id',
        'product_variant_id',
        'product_option_value_id',
    ];
}
