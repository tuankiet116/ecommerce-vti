<?php

namespace App\Exceptions;

use App\Enums\ErrorCode;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Throwable;

class ApiException extends Exception
{
    public function __construct(
        public readonly ErrorCode $errorCode,
        public readonly int $httpStatus = Response::HTTP_BAD_REQUEST,
        ?string $message = null,
        public readonly Throwable|null $previous = null
    ) {
        parent::__construct($message ?? $errorCode->message(), $errorCode->value);
    }

    public function render($request): JsonResponse
    {
        return response()->json([
            'error_code' => $this->errorCode->value,
            'message' => $this->getMessage(),
        ], $this->httpStatus);
    }

    public function report(): void
    {
        if ($this->previous) {
            \Log::error($this->getMessage(), [
                'error_code' => $this->errorCode->value,
                'route' => request()->route()->uri(),
                'message' => $this->previous->getMessage(),
                'file' => $this->previous->getFile() . ':' . $this->previous->getLine(),
            ]);
        }
    }
}
