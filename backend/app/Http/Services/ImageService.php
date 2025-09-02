<?php

namespace App\Http\Services;

use App\Enums\ErrorCode;
use App\Exceptions\ApiException;
use App\Models\ImageModel;
use Illuminate\Http\UploadedFile;
use Storage;
use Str;
use DB;

class ImageService
{
    public function getImageByUUID($uuid)
    {
        $image = ImageModel::find($uuid);
        if (!$image) {
            return null;
        }
        return $image;
    }

    public function uploadImage(UploadedFile $image)
    {
        $shopId = app('my_shop_profile')?->id;
        $uuid = Str::uuid()->toString();
        $fileName = $uuid . '.' . $image->getClientOriginalExtension();
        $path = $image->storeAs("images/$shopId", $fileName, 'public');

        $imageModel = ImageModel::create([
            'uuid' => $uuid,
            'shop_id' => $shopId,
            'url' => $path,
            'alt_text' => '',
            'is_used' => true,
            'name' => $image->getClientOriginalName(),
            'size' => $image->getSize(),
        ]);

        return $imageModel;
    }

    public function deleteImage($uuid)
    {
        DB::beginTransaction();
        try {
            $shopId = app('my_shop_profile')?->id;
            $image = ImageModel::where('uuid', $uuid)->where('shop_id', $shopId)->first();
            $image->products()->detach();
            $image->productVariants()->detach();
            if (!$image) throw new ApiException(ErrorCode::NOT_FOUND);

            Storage::delete($image->getRawOriginal("url"));
            defer(fn() => DB::commit());
            return $image->delete();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new ApiException(ErrorCode::NOT_FOUND, 'Image not found or could not be deleted.');
            return false;
        }
    }

    public function getImagesByShopId($shopId)
    {
        $images = ImageModel::where('shop_id', $shopId)->orderBy("created_at", "DESC")->paginate(20);

        return $images->toArray();
    }
}
