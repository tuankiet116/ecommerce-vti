<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseFormRequest;
use Str;

class UpdateShopProfileRequest extends BaseFormRequest
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
            "shop_id" => "required|integer|exists:shop_profiles,id",
            "shop_name" => "required|string|max:255|unique:shop_profiles,shop_name," . $this->shop_id,
            "handle" => "required|unique:shop_profiles,handle|string|max:255",
            "description" => "nullable|string|max:1000",
            "address" => "required|string|max:255",
            "state" => "nullable|string|max:255",
            "city" => "nullable|string|max:255",
            "zip_code" => "nullable|string|max:20",
            "country" => "required|string|max:255",
        ];
    }

    public function prepareForValidation(): void
    {
        $handle = Str::slug($this->shop_name, '-');
        $this->merge([
            'handle' => $handle,
        ]);
    }
}
