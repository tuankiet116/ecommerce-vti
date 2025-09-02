<?php

namespace App\Http\Services;

use App\Enums\ErrorCode;
use App\Exceptions\ApiException;
use App\Mail\Admin\NewShopRegistered;
use App\Mail\Shop\RegisteredSuccess;
use App\Models\ShopModel;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Log;
use Mail;
use Storage;
use Str;

class ShopService
{
    public function getProfile(): ErrorCode|ShopModel
    {
        $user = Auth::user();
        $shopProfile = ShopModel::with(['user:id,email'])->where('user_credential_id', $user->id)->first();
        if (!$shopProfile) {
            throw new ApiException(ErrorCode::SHOP_PROFILE_NOT_FOUND);
        }

        return $shopProfile;
    }

    public function getProfileById($shopId): ErrorCode|ShopModel
    {
        $shopProfile = ShopModel::where('id', $shopId)
            ->select(['id', 'shop_name', "handle", 'description', 'profile_image', 'banner_image'])->first();
        if (!$shopProfile) {
            return ErrorCode::PROFILE_NOT_FOUND;
        }
        return $shopProfile;
    }

    public function createProfile($data): ErrorCode|ShopModel
    {
        try {
            $userId = Auth::id();
            if (ShopModel::where('user_credential_id', $userId)->exists()) {
                Log::warning('Shop profile already exists for user ID: ' . $userId);
                return ErrorCode::PROFILE_DUPLICATE;
            }

            $shopData = array_merge(['user_credential_id' => $userId], $data);
            $shop = ShopModel::create($shopData);
            if (!$shop) return ErrorCode::PROFILE_CREATION_FAILED;

            $shop->load('user:id,email');
            Mail::to($shop->contact_person_email)->send(new RegisteredSuccess($shop));
            Mail::to(config("app.admin_email"))->send(new NewShopRegistered($shop));

            return $shop;
        } catch (\Exception $e) {
            Log::error('Create profile error: ' . $e->getMessage());
            return ErrorCode::PROFILE_CREATION_FAILED;
        }
    }

    public function updateProfile($data): ErrorCode|ShopModel
    {
        try {
            $userId = Auth::id();
            $shop = ShopModel::where('user_credential_id', $userId)->find($data['shop_id']);

            $data = array_filter($data, function ($value) {
                return !is_null($value) && $value !== '';
            });

            $data = array_merge($data, [
                'handle' => Str::slug($shop->shop_name, '-'),
            ]);

            $shop->update($data);
            $shop->load('user:id,email');

            return $shop;
        } catch (\Exception $e) {
            Log::error('Update profile error: ' . $e->getMessage());
            return ErrorCode::PROFILE_UPDATE_FAILED;
        }
    }

    public function updateAvatar($shopId, UploadedFile $avatarImage, $isRemove): ErrorCode|ShopModel
    {
        try {
            $userId = Auth::id();
            $shop = ShopModel::where('user_credential_id', $userId)->find($shopId);

            if ($shop->getRawOriginal('profile_image')) {
                Storage::delete($shop->getRawOriginal('profile_image'));
            }

            if ($isRemove) {
                $shop->profile_image = null;
            } else {
                $shop->profile_image = Storage::putFile('avatars/shops', $avatarImage, 'public');
            }
            $shop->save();
            $shop->load('user:id,email');

            return $shop;
        } catch (\Exception $e) {
            Log::error('Update shop avatar error: ' . $e->getMessage());
            return ErrorCode::PROFILE_UPDATE_FAILED;
        }
    }

    public function getShopProfileAuthenticatedUser(): ?ShopModel
    {
        $user = Auth::user()->load('shopProfile');
        return $user->shopProfile;
    }
}
