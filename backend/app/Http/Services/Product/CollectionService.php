<?php

namespace App\Http\Services\Product;

use App\Enums\ErrorCode;
use App\Exceptions\ApiException;
use App\Models\CollectionModel;

class CollectionService
{
    public function createCollection(array $data)
    {
        $shopId = app("my_shop_profile")?->id;
        $collection = CollectionModel::create([
            'shop_id' => $shopId,
            ...$data,
        ]);
        return $collection;
    }

    public function updateCollection($collectionId, array $data)
    {
        $shopId = app("my_shop_profile")?->id;
        $collection = CollectionModel::where("id", $collectionId)->where("shop_id", $shopId)->first();

        if (!$collection) {
            throw new ApiException(ErrorCode::NOT_FOUND);
        }

        $collection->update($data);

        return $collection;
    }

    public function deleteCollection($collectionId)
    {
        $shopId = app("my_shop_profile")?->id;
        $collection = CollectionModel::where("id", $collectionId)->where("shop_id", $shopId)->first();

        if (!$collection) {
            throw new ApiException(ErrorCode::NOT_FOUND);
        }

        $collection->products()->detach();
        $collection->delete();

        return true;
    }

    public function getCollectionById($collectionId)
    {
        $shopId = app("my_shop_profile")?->id;
        $collection = CollectionModel::where("id", $collectionId)->where("shop_id", $shopId)->first();

        if (!$collection) {
            throw new ApiException(ErrorCode::NOT_FOUND);
        }

        return $collection;
    }

    public function getCollections($filters = [])
    {
        $query = CollectionModel::query();

        if (isset($filters['is_active'])) {
            $active = filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $active);
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        $shopId = app("my_shop_profile")?->id;
        $collections = $query->where("shop_id", $shopId)->paginate(20);

        return $collections;
    }

    public function getPublicCollections($shopId)
    {
        $collections = CollectionModel::where("shop_id", $shopId)
            ->where("is_active", true)
            ->paginate(20);

        return $collections;
    }

    public function getPublicCollectionById($collectionId)
    {
        $collection = CollectionModel::where("id", $collectionId)
            ->where("is_active", true)
            ->first();

        if (!$collection) {
            throw new ApiException(ErrorCode::NOT_FOUND);
        }

        return $collection;
    }
}
