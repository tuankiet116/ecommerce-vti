<?php

namespace App\Http\Services\Product;

use App\Models\CategoryModel;
use DB;
use Log;

class CategoryService
{
    public function index(?int $parentId = null)
    {
        $categories = CategoryModel::where(["parent_id" => $parentId, "is_active" => true])->orderBy("id", "desc")->get()->toArray();
        return $categories;
    }
}
