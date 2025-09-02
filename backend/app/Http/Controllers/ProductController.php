<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\BulkUpdateStatusRequest;
use App\Http\Requests\Product\CreateProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\Product\ProductResource;
use App\Http\Services\Product\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(protected ProductService $productService) {}

    public function index()
    {
        $filters = request()->only(['is_active', 'search']);
        $products = $this->productService->getProductList($filters);
        return response()->json($products);
    }

    public function show($id)
    {
        $product = $this->productService->getProductById($id);
        return $this->responseJson(ProductResource::make($product));
    }

    public function createProduct(CreateProductRequest $request)
    {
        $data = $request->validated();
        $product = $this->productService->createProduct($data);

        return $this->responseJson(ProductResource::make($product));
    }

    public function updateProduct($id, UpdateProductRequest $request)
    {
        $data = $request->validated();
        $product = $this->productService->updateProduct($id, $data);

        return $this->responseJson(ProductResource::make($product));
    }

    public function publicIndex($shopId)
    {
        $filters = request()->only(['is_active', 'search']);
        $products = $this->productService->getPublicProductList($shopId, $filters);
        return $this->responseJson($products->toArray());
    }

    public function showPublic($id)
    {
        $product = $this->productService->getPublicProductById($id);
        return $this->responseJson($product);
    }

    public function statistics()
    {
        $stats = $this->productService->getProductStatistics();
        return $this->responseJson($stats);
    }

    public function deleteProduct($id)
    {
        $this->productService->deleteProduct($id);
        return $this->responseJson(['message' => 'Product deleted successfully']);
    }

    public function bulkUpdateStatus(BulkUpdateStatusRequest $request)
    {
        $data = $request->validated();
        $ids = $data['ids'];
        $isActive = $data['is_active'];

        $this->productService->bulkUpdateStatus($ids, $isActive);
        return $this->responseJson(['message' => 'Products updated successfully']);
    }

    public function bulkDeleteProducts(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) {
            return $this->responseJson(['message' => 'Products deleted successfully']);
        }

        $this->productService->bulkDeleteProducts($ids);
        return $this->responseJson(['message' => 'Products deleted successfully']);
    }
}
