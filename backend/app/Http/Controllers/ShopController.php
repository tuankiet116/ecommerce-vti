<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\StoreShopProfileRequest;
use App\Http\Services\ShopService;
use Knuckles\Scribe\Attributes\ResponseFromFile;
use App\Enums\ErrorCode;
use App\Http\Requests\Shop\UpdateShopAvatarRequest;
use App\Http\Requests\Shop\UpdateShopProfileRequest;

class ShopController extends Controller
{
    public function __construct(protected ShopService $shopService) {}

    /**
     * Create a new shop profile.
     *
     * This method handles the creation of a shop profile.
     * After shop profile created successfully, user need to wait for admin approval.
     * @authenticated	
     * @group Profile Shop
     * @param StoreShopProfileRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    #[ResponseFromFile("storage/responses/auth/401.json", 401)]
    #[ResponseFromFile("storage/responses/profile/shop/create-shop.200.json", 200)]
    #[ResponseFromFile("storage/responses/profile/shop/create-shop.400.json", 400)]
    #[ResponseFromFile("storage/responses/profile/shop/create-shop.409.json", 409)]
    public function createProfile(StoreShopProfileRequest $request)
    {
        $data = $request->validated();
        $shop = $this->shopService->createProfile($data);
        if ($shop instanceof ErrorCode) {
            return $this->responseError($shop);
        }
        return $this->responseSuccess($shop->toArray());
    }

    /**
     * Update the shop profile.
     *
     * This method handles the update of an existing shop profile.
     * @authenticated
     * @group Profile Shop
     * @param UpdateShopProfileRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    #[ResponseFromFile("storage/responses/auth/401.json", 401)]
    #[ResponseFromFile("storage/responses/profile/shop/get-shop.200.json", 200)]
    #[ResponseFromFile("storage/responses/profile/shop/get-shop.403.json", 403)]
    #[ResponseFromFile("storage/responses/profile/shop/update-shop.400.json", 400)]
    public function updateProfile(UpdateShopProfileRequest $request)
    {
        $data = $request->validated();
        $shop = $this->shopService->updateProfile($data);
        if ($shop instanceof ErrorCode) {
            return $this->responseError($shop);
        }
        return $this->responseSuccess($shop->toArray());
    }

    /**
     * Update the shop avatar.
     *
     * This method handles the update of the shop avatar.
     * @authenticated
     * @group Profile Shop
     * 
     * @param UpdateShopAvatarRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    #[ResponseFromFile("storage/responses/auth/401.json", 401)]
    #[ResponseFromFile("storage/responses/profile/shop/get-shop.200.json", 200)]
    #[ResponseFromFile("storage/responses/profile/shop/get-shop.403.json", 403)]
    #[ResponseFromFile("storage/responses/profile/shop/update-shop.400.json", 400)]
    public function updateAvatar(UpdateShopAvatarRequest $request)
    {
        $shopId = $request->input('shop_id');
        $avatarImage = $request->file('avatar');
        $isRemove = $request->input('is_remove', false);
        $shop = $this->shopService->updateAvatar($shopId, $avatarImage, $isRemove);
        if ($shop instanceof ErrorCode) {
            return $this->responseError($shop);
        }
        return $this->responseSuccess($shop->toArray());
    }

    /**
     * Get public shop profile.
     *
     * This method retrieves the shop profile for everyone.
     * @group Public APIs
     * @unauthenticated
     * @return \Illuminate\Http\JsonResponse
     */
    #[ResponseFromFile("storage/responses/profile/shop/get-public-shop.200.json", 200)]
    #[ResponseFromFile("storage/responses/profile/shop/get-public-shop.404.json", 404)]
    public function getPublicProfile($shopId)
    {
        $shop = $this->shopService->getProfileById($shopId);
        if ($shop instanceof ErrorCode) {
            return $this->responseError($shop, 404);
        }
        return $this->responseSuccess($shop->toArray());
    }

    /**
     * Get the user's shop profile.
     *
     * This method retrieves the shop profile for the authenticated user.
     * @authenticated
     * @group Profile Shop
     * @return \Illuminate\Http\JsonResponse
     */
    #[ResponseFromFile("storage/responses/auth/401.json", 401)]
    #[ResponseFromFile("storage/responses/profile/shop/get-shop.200.json", 200)]
    #[ResponseFromFile("storage/responses/profile/shop/get-shop.403.json", 403)]
    public function getProfile()
    {
        $shop = $this->shopService->getProfile();
        return $this->responseSuccess($shop->toArray());
    }
}
