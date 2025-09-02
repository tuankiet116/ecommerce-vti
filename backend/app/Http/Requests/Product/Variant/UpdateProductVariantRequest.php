<?php

namespace App\Http\Requests\Product\Variant;

use App\Http\Requests\BaseFormRequest;

class UpdateProductVariantRequest extends BaseFormRequest
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
            "sku" => "nullable|string|max:255",
            "price" => "required|numeric|gte:0",
            "compare_at_price" => "nullable|numeric|min:0",
            "inventory_quantity" => "required|integer|min:0",
            "is_default" => "boolean",
        ];
    }
}
