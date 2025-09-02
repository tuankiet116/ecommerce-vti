<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class CategoryModel extends Model
{
    protected $table = "categories";

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['hasChildren'];

    public function products()
    {
        return $this->hasMany(ProductModel::class, 'category_id');
    }

    public function children()
    {
        return $this->hasMany(CategoryModel::class, 'parent_id');
    }

    public function getHasChildrenAttribute()
    {
        return $this->children()->exists();
    }

    public function getParentsAttribute()
    {
        $collection = collect([]);
        $parentId = $this->parent_id;
        while ($parentId) {
            $parent = $this->find($parentId);
            $collection->push($parent);
            $parentId = $parent->parent_id;
        }

        return $collection;
    }
}
