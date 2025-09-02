<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class BaseFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }

    public function failedValidation(Validator $validator)
    {
        $nestedErrors = [];
        foreach ($validator->errors()->messages() as $key => $messages) {
            data_set($nestedErrors, $key, $messages[0]); // Only first error message per field
        }

        throw new HttpResponseException(response()->json([
            'error_code' => Response::HTTP_UNPROCESSABLE_ENTITY,
            'message' => 'Validation failed. Please check the input data.',
            'errors' => $nestedErrors,
        ], Response::HTTP_UNPROCESSABLE_ENTITY));
    }
}
