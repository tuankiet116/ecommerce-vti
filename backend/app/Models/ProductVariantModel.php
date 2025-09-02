<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ProductVariantModel extends Model
{
    protected $table = 'product_variants';

    protected $fillable = [
        'product_id',
        'shop_id',
        'name',
        'sku',
        'price',
        'compare_at_price',
        'inventory_quantity',
        'is_default',
        'is_active',
        'option_value_ids',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'option_value_ids' => 'array',
        'price' => 'float',
        'compare_at_price' => 'float',
    ];

    public function product()
    {
        return $this->belongsTo(ProductModel::class, 'product_id', 'id');
    }

    public function images()
    {
        return $this->morphToMany(ImageModel::class, 'model', ModelImageModel::class, 'model_id', 'image_uuid', 'id', 'uuid');
    }

    public function options()
    {
        return $this->belongsToMany(
            ProductOptionValueModel::class,
            ProductVariantOptionValueModel::class,
            'product_variant_id',
            'product_option_value_id'
        );
    }
}
