<?php

namespace App\Models;

use App\Http\Ultils\AttributeAccessor;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ImageModel extends Model
{
    protected $table = 'images';
    protected $primaryKey = 'uuid';
    protected $fillable = [
        'uuid',
        'shop_id',
        'url',
        'alt_text',
        'is_used',
        'name',
        'size',
    ];

    protected $casts = [
        'uuid' => 'string',
        'is_used' => 'boolean',
    ];

    public function url(): Attribute
    {
        return Attribute::make(
            get: fn($value) => AttributeAccessor::getImageUrl($value),
        );
    }

    public function products()
    {
        return $this->morphedByMany(ProductModel::class, 'model', ModelImageModel::class, 'image_uuid', 'model_id', 'uuid');
    }

    public function productVariants()
    {
        return $this->morphedByMany(ProductVariantModel::class, 'model', ModelImageModel::class, 'image_uuid', 'model_id', 'uuid');
    }
}
