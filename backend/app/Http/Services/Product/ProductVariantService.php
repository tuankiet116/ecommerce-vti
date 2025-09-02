<?php

namespace App\Http\Services\Product;

use App\Enums\ErrorCode;
use App\Exceptions\ApiException;
use App\Http\Services\DatabaseService;
use App\Models\ProductVariantModel;
use Auth;
use DB;
use Storage;

class ProductVariantService
{
    protected $databaseService;

    public function __construct(DatabaseService $databaseService)
    {
        $this->databaseService = $databaseService;
    }

    public function generateOptionValueIds(array $optionValues): array
    {
        return array_map(function ($value) {
            return $this->databaseService->getNextSequenceId('product_option_value_id_seq');
        }, $optionValues);
    }

    public function getVariantsByProductId($productId, $orders = [])
    {
        $shopId = Auth::user()->shopProfile?->id;
        $variantQuery = ProductVariantModel::with(['options', 'images'])
            ->where('product_id', $productId)
            ->where('shop_id', $shopId);
        if (isset($orders['orderBy']) && in_array($orders['orderBy'], ['name', 'sku', 'inventory_quantity', 'created_at'])) {
            $variantQuery = $variantQuery->orderBy($orders['orderBy'], $orders['orderDirection'] ?? 'asc');
        }

        $variants = $variantQuery->get();
        return $variants;
    }

    public function getVariantByProductId($productId, $variantId)
    {
        $shopId = Auth::user()->shopProfile?->id;
        $variant = ProductVariantModel::where('product_id', $productId)
            ->where('shop_id', $shopId)
            ->where('id', $variantId)
            ->with(['options', 'images'])
            ->first();

        if (!$variant) throw new ApiException(ErrorCode::NOT_FOUND);

        return $variant;
    }

    public function updateVariantByProductId($productId, $variantId, array $data)
    {
        $shopId = Auth::user()->shopProfile?->id;
        $variant = ProductVariantModel::where('product_id', $productId)
            ->where('shop_id', $shopId)
            ->where('id', $variantId)
            ->first();

        if (!$variant) throw new ApiException(ErrorCode::NOT_FOUND);
        $variant->update($data);

        return $variant;
    }

    public function deleteVariantByProductId($productId, $variantId)
    {
        $shopId = Auth::user()->shopProfile?->id;
        DB::beginTransaction();
        try {
            $variant = ProductVariantModel::with(["images", "options"])
                ->where('shop_id', $shopId)
                ->where('product_id', $productId)
                ->where('id', $variantId)
                ->firstOrFail();
            $variant->images()->detach();
            $variant->options()->detach();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new ApiException(errorCode: ErrorCode::DEFAULT, previous: $e);
        }
    }

    public function getListVariants()
    {
        $shopId = Auth::user()->shopProfile?->id;
        return ProductVariantModel::with(["product.images", "images"])->where("shop_id", $shopId)->select("id", "name", "sku", "inventory_quantity", "product_id")->paginate(50);
    }

    public function bulkUpdate(array $data)
    {
        $shopId = Auth::user()->shopProfile?->id;
        DB::beginTransaction();
        try {
            // Tách dữ liệu thành các mảng riêng biệt cho UNNEST
            $ids                 = [];
            $skus                = [];
            $inventoryQuantities = [];

            foreach ($data as $item) {
                $ids[]                 = $item['id'];
                $skus[]                = $item['sku'];
                $inventoryQuantities[] = $item['inventory_quantity'];
            }

            $updateQuery = "
                UPDATE product_variants AS pv
                SET 
                    sku = temp.sku,
                    inventory_quantity = temp.inventory_quantity,
                    updated_at = NOW()
                FROM (
                    SELECT unnest(?::int[])    AS id,
                        unnest(?::text[])      AS sku,
                        unnest(?::int[])       AS inventory_quantity
                ) AS temp
                WHERE pv.id = temp.id AND pv.shop_id = $shopId
            ";

            DB::statement($updateQuery, [
                '{' . implode(',', $ids) . '}',
                '{' . implode(',', array_map(fn($v) => '"' . str_replace('"', '\"', $v) . '"', $skus)) . '}',
                '{' . implode(',', $inventoryQuantities) . '}',
            ]);

            DB::commit();

            return ProductVariantModel::with(["product.images", "images"])->where("shop_id", $shopId)->whereIn("id", $ids)
                ->select("id", "name", "sku", "inventory_quantity", "product_id")->get();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new ApiException(errorCode: ErrorCode::DEFAULT, previous: $e);
        }
    }
}
