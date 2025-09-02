<?php

namespace App\Http\Requests\Image;

use App\Http\Requests\BaseFormRequest;

class UploadImageRequest extends BaseFormRequest
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
        return [
            "image" => "required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048",
        ];
    }
}
