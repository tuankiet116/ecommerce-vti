<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\BaseFormRequest;
use App\Models\CategoryModel;
use App\Rules\ImageExist;

class CreateProductRequest extends BaseFormRequest
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
            "name" => "required|string|max:255",
            "description" => "nullable|string",
            "is_active" => "sometimes|boolean",

            "variants" => "required|array|min:1",
            "variants.*.name" => "required|string|max:255",
            "variants.*.sku" => "nullable|string|max:255",
            "variants.*.price" => "required|numeric|gte:0",
            "variants.*.compare_at_price" => "nullable|numeric|min:0",
            "variants.*.inventory_quantity" => "required|integer|min:0",
            "variants.*.is_default" => "boolean",
            "variants.*.images" => "array",
            "variants.*.images.*.uuid" => [new ImageExist],
            'variants.*.option_values' => 'array',
            'variants.*.option_values.*.option' => 'required|string|max:255',
            'variants.*.option_values.*.value' => 'required|string|max:255',

            "options" => "array",
            "options.*.name" => "required|string|max:255",
            "options.*.values" => "required|array|min:1",
            "options.*.values.*" => "required|string|max:255",


            "collection_ids" => "array",
            "collection_ids.*" => "integer|exists:collections,id",
            "category_id" => "nullable|integer",

            "images" => "array",
            "images.*.uuid" => [new ImageExist],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('category_id') && is_numeric($this->input('category_id'))) {
                $category = CategoryModel::find($this->input('category_id'));
                if (!$category) {
                    $validator->errors()->add('category_id', 'The selected category does not exist.');
                }

                if ($category && !$category->is_active) {
                    $validator->errors()->add('category_id', 'The selected category is not active.');
                }

                if ($category && $category->hasChildren) {
                    $validator->errors()->add('category_id', 'The selected category has subcategories. Please select a final category.');
                }
            }

            $variants = $this->input('variants', []) ?? [];
            $optionNames = collect($this->input('options', []))->pluck('name')->toArray();

            if (count($this->input('options', [])) === 0 && count($variants) > 1) {
                $validator->errors()->add('options', 'At least one option must be defined if multiple variants are provided.');
            }

            foreach ($variants as $index => $variant) {
                if (empty($variant['option_values'])) {
                    continue;
                }

                foreach ($variant['option_values'] as $variantOption) {
                    if (!isset($variantOption['option']) || !isset($variantOption['value'])) {
                        $validator->errors()->add("variants.{$index}.option_values", "Option values must have both 'option' and 'value'.");
                        continue;
                    }

                    if (!in_array($variantOption['option'], $optionNames)) {
                        $validator->errors()->add("variants.{$index}.option_values.{$variantOption['option']}", "Option '{$variantOption['option']}' is not defined in options.");
                    }

                    $optionValues = collect($this->input('options', []))
                        ->firstWhere('name', $variantOption['option'])["values"] ?? [];

                    if (!in_array($variantOption['value'], $optionValues)) {
                        $validator->errors()->add("variants.{$index}.option_values.{$variantOption['value']}", "Value '{$variantOption['value']}' for option '{$variantOption['option']}' is not defined in options.");
                    }

                    if (count($optionNames) !== count(array_unique(array_column($variant['option_values'], 'option')))) {
                        $validator->errors()->add("variants.{$index}.option_values", "Each variant must have a value for each option defined.");
                    }
                }
            }
        });
    }
}
