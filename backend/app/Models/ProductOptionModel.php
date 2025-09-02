<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductOptionModel extends Model
{
    protected $table = 'product_options';
    protected $fillable = [
        'shop_id',
        'product_id',
        'name',
    ];

    public function product()
    {
        return $this->belongsTo(ProductModel::class, 'product_id');
    }

    public function optionValue()
    {
        return $this->hasMany(ProductOptionValueModel::class, 'product_option_id');
    }
}
