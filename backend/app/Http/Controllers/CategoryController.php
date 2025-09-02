<?php

namespace App\Http\Controllers;

use App\Http\Services\Product\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $categoryService) {}

    public function index(Request $request)
    {
        $parentId = $request->query('parentId', null);
        $categories = $this->categoryService->index($parentId);

        return $this->responseJson($categories);
    }
}
