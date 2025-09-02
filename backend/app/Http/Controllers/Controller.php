<?php

namespace App\Http\Controllers;

use App\Enums\ErrorCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Response;

abstract class Controller
{
    public function responseSuccess(?array $data = [], string $message = 'Operation completed successfully.', int $httpCode = Response::HTTP_OK)
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $httpCode);
    }

    public function responseError(ErrorCode $errorCode = ErrorCode::DEFAULT,  int $httpCode = Response::HTTP_BAD_REQUEST, $message = '')
    {
        if (!$message) {
            $message = $errorCode->message();
        }
        return response()->json([
            'message' => $message,
            'error_code' => $errorCode->value,
        ], $httpCode);
    }

    public function responseJson(array | Model | ErrorCode | JsonResource | null $data, int $httpCode = Response::HTTP_OK)
    {
        return match (true) {
            $data instanceof ErrorCode => $this->responseError($data, $httpCode),
            $data instanceof Model => $this->responseSuccess($data->toArray()),
            $data instanceof JsonResource => $this->responseSuccess($data->toArray(request())),
            default => $this->responseSuccess($data),
        };
    }
}
