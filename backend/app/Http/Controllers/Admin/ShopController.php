<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateShopStatusRequest;
use App\Http\Services\Admin\ShopService;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function __construct(protected ShopService $shopService) {}

    /**
     * @hideFromAPIDocumentation
     */
    public function getList(Request $request)
    {
        $shops = $this->shopService->getList($request);
        return $this->responseSuccess($shops->toArray());
    }

    /**
     * @hideFromAPIDocumentation
     */
    public function updateStatus(UpdateShopStatusRequest $request, int $shopId)
    {
        $data = $request->validated();
        $this->shopService->updateStatus($shopId, $data['status']);
        return $this->responseSuccess([], "Update status successfully");
    }
}
