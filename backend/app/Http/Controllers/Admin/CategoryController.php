<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Services\Admin\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $categoryService) {}

    public function index(Request $request)
    {
        $parentId = $request->query('parent_id', null);
        $categories = $this->categoryService->index($parentId);
        return response()->json($categories);
    }

    public function create(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        $category = $this->categoryService->create($data);
        return response()->json($category, 201);
    }

    public function update(StoreCategoryRequest $request, $id)
    {
        $data = $request->validated();
        $category = $this->categoryService->update($id, $data);
        return response()->json($category);
    }

    public function delete($id)
    {
        $result = $this->categoryService->delete($id);
        return response()->json(['message' => 'Category deleted successfully'], 204);
    }
}
