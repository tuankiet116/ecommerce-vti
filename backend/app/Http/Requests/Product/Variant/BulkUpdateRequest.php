<?php

namespace App\Http\Requests\Product\Variant;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateRequest extends BaseFormRequest
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
            "*" => "array",
            "*.id" => "required|integer|exists:product_variants,id",
            "*.sku" => "nullable|string|max:255",
            "*.inventory_quantity" => "required|integer|min:0"
        ];
    }
}
