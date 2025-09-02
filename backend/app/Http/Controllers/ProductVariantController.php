<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\Variant\BulkUpdateRequest;
use App\Http\Requests\Product\Variant\UpdateProductVariantRequest;
use App\Http\Services\Product\ProductVariantService;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{

    public function __construct(protected ProductVariantService $productVariantService) {}

    public function getVariantsByProductId(Request $request, $productId)
    {
        $orders = $request->only(['orderBy', 'orderDirection']);
        $variants = $this->productVariantService->getVariantsByProductId($productId, $orders);
        return $this->responseJson($variants->toArray());
    }

    public function getVariantByProductId($productId, $variantId)
    {
        $variant = $this->productVariantService->getVariantByProductId($productId, $variantId);
        return $this->responseJson($variant);
    }

    public function updateVariantByProductId($productId, $variantId, UpdateProductVariantRequest $request)
    {
        $data = $request->validated();
        $variant = $this->productVariantService->updateVariantByProductId($productId, $variantId, $data);
        return $this->responseJson($variant);
    }

    public function deleteVariantByProductId($productId, $variantId)
    {
        $this->productVariantService->deleteVariantByProductId($productId, $variantId);
        return $this->responseJson([]);
    }

    public function getVariants(Request $request)
    {
        $productVariants = $this->productVariantService->getListVariants();
        return $this->responseJson($productVariants->toArray());
    }

    public function bulkUpdate(BulkUpdateRequest $request)
    {
        $data = $request->validated();
        $updatedVariants = $this->productVariantService->bulkUpdate($data);
        return $this->responseJson($updatedVariants->toArray(), 204);
    }
}
