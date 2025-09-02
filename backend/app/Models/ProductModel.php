<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Str;

class ProductModel extends Model
{
    protected $table = 'products';
    protected $fillable = [
        'shop_id',
        'collection_id',
        'category_id',
        'name',
        'slug',
        'description',
        'is_active',
    ];

    public function slug(): Attribute
    {
        return Attribute::make(
            set: fn($value, array $attributes) => Str::slug($attributes["name"], '-'),
        );
    }

    public function options()
    {
        return $this->hasMany(ProductOptionModel::class, 'product_id');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariantModel::class, 'product_id');
    }

    public function category()
    {
        return $this->belongsTo(CategoryModel::class, 'category_id');
    }

    public function collections()
    {
        return $this->belongsToMany(CollectionModel::class, ProductCollectionModel::class, 'product_id', 'collection_id');
    }

    public function images()
    {
        return $this->morphToMany(ImageModel::class, 'model', ModelImageModel::class, 'model_id', 'image_uuid', 'id', 'uuid');
    }
}
