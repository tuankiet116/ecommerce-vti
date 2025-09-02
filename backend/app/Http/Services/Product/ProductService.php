<?php

namespace App\Http\Services\Product;

use App\Enums\ErrorCode;
use App\Exceptions\ApiException;
use App\Http\Services\DatabaseService;
use App\Models\ModelImageModel;
use App\Models\ProductModel;
use App\Models\ProductOptionModel;
use App\Models\ProductOptionValueModel;
use App\Models\ProductVariantModel;
use App\Models\ProductVariantOptionValueModel;
use DB;
use Exception;
use Log;
use Str;

class ProductService
{
    public function __construct(protected DatabaseService $databaseService) {}

    protected function getNextSequenceId(string $sequenceName): int
    {
        return $this->databaseService->getNextSequenceId($sequenceName);
    }

    protected function getShopContext(): array
    {
        return [
            'shop_id' => app('my_shop_profile')?->id,
            'now' => now(),
        ];
    }

    protected function prepareProductOptions(
        array $options,
        int $productId,
        array $context,
        array &$optionValueMap
    ): array {
        $productOptions = [];
        $productOptionValues = [];

        foreach ($options as $option) {
            $optionId = $this->getNextSequenceId('product_options_id_seq');
            $productOptions[] = [
                'id' => $optionId,
                'shop_id' => $context['shop_id'],
                'product_id' => $productId,
                'name' => $option['name'],
                'created_at' => $context['now'],
                'updated_at' => $context['now'],
            ];

            foreach ($option['values'] as $value) {
                $valueId = $this->getNextSequenceId('product_option_values_id_seq');
                $productOptionValues[] = [
                    'id' => $valueId,
                    'shop_id' => $context['shop_id'],
                    'product_id' => $productId,
                    'product_option_id' => $optionId,
                    'value' => $value,
                    'created_at' => $context['now'],
                    'updated_at' => $context['now'],
                ];
                $optionValueMap[$option['name']][$value] = $valueId;
            }
        }

        return [$productOptions, $productOptionValues];
    }

    protected function prepareProductVariants(
        array $variants,
        int $productId,
        array $context,
        array $optionValueMap
    ): array {
        $variantRecords = [];
        $pivotRecords = [];
        $imageRecords = [];
        foreach ($variants as $variant) {
            $variantId = $this->getNextSequenceId('product_variants_id_seq');
            $variantRecords[] = [
                'id' => $variantId,
                'shop_id' => $context['shop_id'],
                'product_id' => $productId,
                'name' => $this->generateVariantName($variant['option_values']),
                'sku' => $variant['sku'],
                'price' => $variant['price'],
                'compare_at_price' => $variant['compare_at_price'] ?? null,
                'inventory_quantity' => $variant['inventory_quantity'] ?? 0,
                'is_default' => $variant['is_default'] ?? false,
                'is_active' => true,
                'created_at' => $context['now'],
                'updated_at' => $context['now'],
            ];

            foreach ($variant['option_values'] as $opt) {
                $optValueId = $optionValueMap[$opt['option']][$opt['value']] ?? null;
                if (!$optValueId) {
                    throw new Exception("Missing option value '{$opt['value']}' for option '{$opt['option']}'");
                }
                $pivotRecords[] = [
                    'shop_id' => $context['shop_id'],
                    'product_id' => $productId,
                    'product_variant_id' => $variantId,
                    'product_option_value_id' => $optValueId,
                    'created_at' => $context['now'],
                    'updated_at' => $context['now'],
                ];
            }

            if (!empty($variant['images'])) {
                $imageUuids = collect($variant['images'])->pluck('uuid')->toArray();
                foreach ($imageUuids as $imageUuid) {
                    $imageRecords[] = [
                        'model_id' => $variantId,
                        'model_type' => ProductVariantModel::class,
                        'image_uuid' => $imageUuid,
                        'shop_id' => $context['shop_id'],
                    ];
                }
            }
        }

        return [$variantRecords, $pivotRecords, $imageRecords];
    }

    public function getProductList(array $filters = [])
    {
        $query = ProductModel::query();
        $context = $this->getShopContext();
        $query->with(["images", "category"])->withSum("variants as inventory", "inventory_quantity")->where('shop_id', $context['shop_id']);

        if (isset($filters['is_active']) && isset($filters['is_active'])) {
            $isActive = filter_var($filters['is_active'], FILTER_VALIDATE_BOOL);
            $query->where('is_active', $isActive);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('slug', 'ilike', "%{$search}%");
            });
        }

        return $query->orderBy("id", "DESC")->paginate(20);
    }

    public function getProductById($productId)
    {
        $context = $this->getShopContext();
        $product = ProductModel::with(['images', 'options.optionValue', 'variants.images', 'variants.options', 'collections'])
            ->where('id', $productId)
            ->where('shop_id', $context['shop_id'])
            ->first();

        if (!$product) {
            throw new ApiException(ErrorCode::NOT_FOUND);
        }

        $product->categories = DB::select("
            WITH RECURSIVE category_tree AS (
                SELECT c.id, c.parent_id, c.name
                FROM products p
                JOIN categories c ON p.category_id = c.id
                WHERE p.id = :product_id

                UNION ALL

                SELECT c.id, c.parent_id, c.name
                FROM categories c
                INNER JOIN category_tree ct ON ct.parent_id = c.id
            )
            SELECT 
                ct.*,
                EXISTS (
                    SELECT 1 
                    FROM categories c2 
                    WHERE c2.parent_id = ct.id
                ) AS hasChildren
            FROM category_tree ct;
        ", ['product_id' => $productId]);

        return $product;
    }

    public function getPublicProductById($productId)
    {
        $product = ProductModel::with(['images', 'options.optionValue', 'variants.options', 'category', 'collections'])
            ->where('id', $productId)
            ->first();

        if (!$product) {
            throw new ApiException(ErrorCode::NOT_FOUND);
        }

        return $product;
    }

    public function getPublicProductList(int $shopId, array $filters = [])
    {
        $query = ProductModel::query();
        $query->where("shop_id", $shopId)->where('is_active', true);

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('slug', 'ilike', "%{$search}%");
            });
        }

        return $query->paginate(20);
    }

    public function createProduct(array $data)
    {
        DB::beginTransaction();
        $context = $this->getShopContext();

        try {
            $product = ProductModel::create([
                'shop_id' => $context['shop_id'],
                'name' => $data['name'],
                'slug' => Str::slug($data['name'], '-'),
                'description' => $data['description'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'category_id' => $data['category_id'] ?? null,
            ]);

            $optionValueMap = [];
            [$productOptions, $productOptionValues] = $this->prepareProductOptions(
                $data['options'] ?? [],
                $product->id,
                $context,
                $optionValueMap
            );
            ProductOptionModel::insert($productOptions);
            ProductOptionValueModel::insert($productOptionValues);

            [$variantRecords, $pivotRecords, $imageRecords] = $this->prepareProductVariants(
                $data['variants'],
                $product->id,
                $context,
                $optionValueMap
            );
            ProductVariantModel::insert($variantRecords);
            ProductVariantOptionValueModel::insert($pivotRecords);
            ModelImageModel::insert($imageRecords);

            if (!empty($data['collection_ids'])) {
                $product->collections()->attach($data['collection_ids'], [
                    "shop_id" => $context['shop_id'],
                ]);
            }

            if (!empty($data['images'])) {
                $imageUuids = collect($data['images'])->pluck('uuid')->toArray();
                $product->images()->attach($imageUuids, [
                    "shop_id" => $context['shop_id'],
                ]);
            }

            DB::commit();
            return $this->getProductById($product->id);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error creating product:", ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            throw new Exception("Error creating product: " . $e->getMessage());
        }
    }

    public function updateProduct($productId, array $data)
    {
        DB::beginTransaction();
        $context = $this->getShopContext();

        try {
            $product = ProductModel::where('id', $productId)
                ->where('shop_id', $context['shop_id'])
                ->first();

            if (!$product) {
                throw new ApiException(ErrorCode::NOT_FOUND);
            }

            $product->update([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'category_id' => $data['category_id'] ?? null,
            ]);

            $dataOptions = collect($data['options']);
            $currentProductOptions = ProductOptionModel::where('product_id', $product->id)->get();
            $currentOptionValues = ProductOptionValueModel::where('product_id', $product->id)->get();
            $dataOptionValueMap = [];

            $dataInsertOptions = [];
            $dataInsertOptionValues = [];

            foreach ($currentProductOptions as $currentOption) {
                $dataOption = $dataOptions->where('name', $currentOption->name)->first();
                if ($dataOption) {
                    $dataValues = collect($dataOption['values']);
                    $currentValues = collect($currentOptionValues)->where('product_option_id', $currentOption->id);

                    foreach ($currentValues as $currentValue) {
                        if ($dataValues->contains($currentValue->value)) {
                            $dataValues = $dataValues->reject(function ($item) use ($currentValue) {
                                return $item === $currentValue->value;
                            });
                            $dataOptionValueMap[$currentOption->name][$currentValue->value] = $currentValue->id;
                        } else {
                            $currentValue->delete();
                        }
                    }

                    foreach ($dataValues as $newValue) {
                        $newValueId = $this->getNextSequenceId('product_option_values_id_seq');
                        $dataInsertOptionValues[] = [
                            'id' => $newValueId,
                            'shop_id' => $context['shop_id'],
                            'product_id' => $product->id,
                            'product_option_id' => $currentOption->id,
                            'value' => $newValue,
                            'created_at' => $context['now'],
                            'updated_at' => $context['now'],
                        ];
                        $dataOptionValueMap[$currentOption->name][$newValue] = $newValueId;
                    }

                    $dataOptions = $dataOptions->reject(function ($item) use ($currentOption) {
                        return $item['name'] === $currentOption->name;
                    });
                } else {
                    $currentOption->delete();
                }
            }

            [$newOptions, $newOptionValues] = $this->prepareProductOptions(
                $dataOptions->toArray(),
                $product->id,
                $context,
                $dataOptionValueMap
            );
            $dataInsertOptions = array_merge($dataInsertOptions, $newOptions);
            $dataInsertOptionValues = array_merge($dataInsertOptionValues, $newOptionValues);

            ProductOptionModel::insert($dataInsertOptions);
            ProductOptionValueModel::insert($dataInsertOptionValues);

            $currentVariants = ProductVariantModel::where('product_id', $productId)->get();
            $dataVariants = collect($data['variants']);
            $variantIdMap = [];

            foreach ($currentVariants as $currentVariant) {
                $dataVariant = $dataVariants->where('id', $currentVariant->id)->first();
                if ($dataVariant) {
                    $imageUuids = collect($dataVariant['images'] ?? [])
                        ->pluck('uuid')
                        ->toArray();
                    $currentVariant->images()->syncWithPivotValues($imageUuids, [
                        "shop_id" => $context['shop_id'],
                    ]);

                    $currentVariant->update([
                        'name' => $this->generateVariantName($dataVariant['option_values'] ?? []),
                        'sku' => $dataVariant['sku'],
                        'price' => $dataVariant['price'],
                        'compare_at_price' => $dataVariant['compare_at_price'] ?? null,
                        'inventory_quantity' => $dataVariant['inventory_quantity'] ?? 0,
                        'is_default' => $dataVariant['is_default'] ?? false,
                    ]);
                    $variantIdMap[] = [
                        'id' => $currentVariant->id,
                        'data' => $dataVariant,
                    ];
                    $dataVariants = $dataVariants->reject(function ($item) use ($currentVariant) {
                        return isset($item['id']) && $item['id'] === $currentVariant->id;
                    });
                } else {
                    $currentVariant->delete();
                    $currentVariant->images()->detach();
                }
            }

            [$dataInsertVariants, $productVariantOptionValues, $imageRecords] = $this->prepareProductVariants(
                $dataVariants->toArray(),
                $productId,
                $context,
                $dataOptionValueMap
            );

            ProductVariantModel::insert($dataInsertVariants);
            ModelImageModel::insert($imageRecords);

            $currentProductVariantOptionValues = ProductVariantOptionValueModel::where('product_id', $productId)->get();
            $newPivotRecords = [];

            foreach ($variantIdMap as $variantInfo) {
                $variantId = $variantInfo['id'];
                foreach ($variantInfo['data']['option_values'] ?? [] as $opt) {
                    $optValueId = $dataOptionValueMap[$opt['option']][$opt['value']] ?? null;
                    $current = $currentProductVariantOptionValues
                        ->where('product_variant_id', $variantId)
                        ->where('product_option_value_id', $optValueId)
                        ->first();

                    if ($current) {
                        $currentProductVariantOptionValues = $currentProductVariantOptionValues->reject(function ($item) use ($current) {
                            return $item->id === $current->id;
                        });
                    } else {
                        $newPivotRecords[] = [
                            'shop_id' => $context['shop_id'],
                            'product_id' => $productId,
                            'product_variant_id' => $variantId,
                            'product_option_value_id' => $optValueId,
                            'created_at' => $context['now'],
                            'updated_at' => $context['now'],
                        ];
                    }
                }
            }

            ProductVariantOptionValueModel::whereIn('id', $currentProductVariantOptionValues->pluck('id'))->delete();
            ProductVariantOptionValueModel::insert(array_merge($productVariantOptionValues, $newPivotRecords));

            $product->collections()->syncWithPivotValues($data['collection_ids'] ?? [], [
                "shop_id" => $context['shop_id'],
            ]);

            $imageUuids = collect($data['images'])->pluck('uuid')->toArray();
            $product->images()->syncWithPivotValues($imageUuids, [
                "shop_id" => $context['shop_id'],
            ]);

            DB::commit();
            return $this->getProductById($productId);
        } catch (Exception $e) {
            DB::rollBack();
            if ($e instanceof ApiException) {
                throw $e;
            }
            throw new ApiException(errorCode: ErrorCode::DEFAULT, previous: $e);
        }
    }

    public function generateVariantName(array $optionValues): string
    {
        if (empty($optionValues)) {
            return 'Default';
        }
        return collect($optionValues)
            ->map(function ($opt) {
                return "{$opt['value']}";
            })
            ->implode(' / ');
    }

    public function getProductStatistics()
    {
        $context = $this->getShopContext();
        $totalProducts = ProductModel::where('shop_id', $context['shop_id'])->count();
        $activeProducts = ProductModel::where('shop_id', $context['shop_id'])->where('is_active', true)->count();
        $inactiveProducts = ProductModel::where('shop_id', $context['shop_id'])->where('is_active', false)->count();

        return [
            'total' => $totalProducts,
            'active' => $activeProducts,
            'inactive' => $inactiveProducts,
        ];
    }

    public function deleteProduct($productId)
    {
        $context = $this->getShopContext();
        $product = ProductModel::where('id', $productId)
            ->where('shop_id', $context['shop_id'])
            ->first();

        if (!$product) {
            throw new ApiException(ErrorCode::NOT_FOUND);
        }

        $product->images()->detach();
        $product->collections()->detach();
        ProductOptionModel::where('product_id', $product->id)->delete();
        ProductOptionValueModel::where('product_id', $product->id)->delete();
        $product->variants()->each(function ($variant) {
            $variant->images()->detach();
        });
        $product->variants()->delete();

        $product->delete();
    }

    public function bulkDeleteProducts(array $productIds)
    {
        try {
            DB::beginTransaction();
            $context = $this->getShopContext();
            $products = ProductModel::whereIn('id', $productIds)
                ->where('shop_id', $context['shop_id'])
                ->get();

            foreach ($products as $product) {
                $product->images()->detach();
                $product->collections()->detach();
                ProductOptionModel::where('product_id', $product->id)->delete();
                ProductOptionValueModel::where('product_id', $product->id)->delete();
                $product->variants()->each(function ($variant) {
                    $variant->images()->detach();
                });
                $product->variants()->delete();
                $product->delete();
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error bulk deleting products: ", [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new ApiException(ErrorCode::DEFAULT);
        }
    }

    public function bulkUpdateStatus(array $productIds, bool $isActive)
    {
        try {
            DB::beginTransaction();
            $context = $this->getShopContext();
            ProductModel::whereIn('id', $productIds)
                ->where('shop_id', $context['shop_id'])
                ->update(['is_active' => $isActive]);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error bulk updating product status: ", [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw new ApiException(ErrorCode::DEFAULT);
        }
    }
}
