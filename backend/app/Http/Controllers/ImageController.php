<?php

namespace App\Http\Controllers;

use App\Http\Requests\Image\UploadImageRequest;
use App\Http\Services\ImageService;
use Knuckles\Scribe\Attributes\ResponseFromFile;

class ImageController extends Controller
{
    public function __construct(protected ImageService $imageService) {}

    public function upload(UploadImageRequest $request)
    {
        $image = $request->file('image');
        $image = $this->imageService->uploadImage($image);
        return $this->responseJson($image);
    }

    public function getImageByUUID($uuid)
    {
        $image = $this->imageService->getImageByUUID($uuid);
        if (!$image) {
            return $this->responseJson(['message' => 'Image not found'], 404);
        }
        return $this->responseJson($image);
    }

    public function delete($uuid)
    {
        $deleted = $this->imageService->deleteImage($uuid);
        if (!$deleted) {
            return $this->responseJson(['message' => 'Image not found or could not be deleted'], 404);
        }
        return $this->responseJson(['message' => 'Image deleted successfully']);
    }

    public function listImages()
    {
        $shopId = app('my_shop_profile')->id;
        $images = $this->imageService->getImagesByShopId($shopId);

        return $this->responseJson($images);
    }
}
