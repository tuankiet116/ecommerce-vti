<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCollectionModel extends Model
{
    protected $table = 'product_collections';
    protected $fillable = [
        'shop_id',
        'product_id',
        'collection_id',
    ];
}
