<?php

namespace App\Http\Services\Admin;

use App\Models\CategoryModel;
use DB;
use Log;

class CategoryService
{
    public function index(?int $parentId = null)
    {
        $categories = CategoryModel::where("parent_id", $parentId)->orderBy("id", "desc")->get()->toArray();
        return $categories;
    }

    public function create(array $data)
    {
        $category = CategoryModel::create($data);
        return $category;
    }

    public function update(int $id, array $data)
    {
        $category = CategoryModel::findOrFail($id);
        $category->update($data);
        return $category;
    }

    public function delete(int $id)
    {
        DB::beginTransaction();
        try {
            $category = CategoryModel::findOrFail($id);
            $category->products()->update(['category_id' => null]);

            $subCategories = CategoryModel::where('parent_id', $id)->get();
            $subCategories->each(function ($childCategory) {
                $childCategory->products()->update(['category_id' => null]);
                $childCategory->delete();
            });

            $category->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("[Admin] Failed to delete category with ID {$id}: " . $e->getMessage());
            return false;
        }
        return true;
    }
}
