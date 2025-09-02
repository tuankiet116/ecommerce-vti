<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Str;

class CollectionModel extends Model
{
    protected $table = 'collections';

    protected $fillable = [
        'shop_id',
        'name',
        'slug',
        'description',
        'is_active',
    ];

    public function products()
    {
        return $this->belongsToMany(ProductModel::class, ProductCollectionModel::class, 'collection_id', 'product_id');
    }

    public function slug(): Attribute
    {
        return Attribute::make(
            set: fn($value, array $attributes) => Str::slug($attributes["name"], '-'),
        );
    }
}
