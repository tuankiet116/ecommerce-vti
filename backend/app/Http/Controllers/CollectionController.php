<?php

namespace App\Http\Controllers;

use App\Http\Requests\Collection\StoreCollectionRequest;
use App\Http\Services\Product\CollectionService;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    public function __construct(protected CollectionService $collectionService) {}

    public function index()
    {
        $filters = request()->only(['is_active', 'search']);
        $collections = $this->collectionService->getCollections($filters);
        return $this->responseJson($collections->toArray());
    }

    public function show(Request $request, $id)
    {
        $collection = $this->collectionService->getCollectionById($id);
        return $this->responseJson($collection);
    }

    public function create(StoreCollectionRequest $request)
    {
        $data = $request->validated();
        $collection = $this->collectionService->createCollection($data);
        return $this->responseJson($collection);
    }

    public function update($id, StoreCollectionRequest $request)
    {
        $data = $request->validated();
        $collection = $this->collectionService->updateCollection($id, $data);
        return $this->responseJson($collection);
    }

    public function delete($id)
    {
        $this->collectionService->deleteCollection($id);
        return $this->responseJson([], 204);
    }

    public function listPublicCollections(Request $request)
    {
        $shopId = $request->get('shopId', null);
        $collections = $this->collectionService->getPublicCollections($shopId);
        return $this->responseJson($collections->toArray());
    }

    public function getPublicCollectionById($collectionId)
    {
        $collection = $this->collectionService->getPublicCollectionById($collectionId);
        return $this->responseJson($collection);
    }
}
