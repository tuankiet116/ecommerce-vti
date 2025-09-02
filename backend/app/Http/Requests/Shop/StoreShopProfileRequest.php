<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseFormRequest;
use Str;

class StoreShopProfileRequest extends BaseFormRequest
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
            "shop_name" => "required|string|max:255|unique:shop_profiles,shop_name",
            "handle" => "required|unique:shop_profiles,handle|string|max:255",
            "bussiness_name" => "required|string|max:255",
            "bussiness_number" => "required|string|max:255|unique:shop_profiles,bussiness_number",
            "bussiness_tax_number" => "nullable|string|max:255|unique:shop_profiles,bussiness_tax_number",
            "legal_person_first_name" => "nullable|string|max:255",
            "legal_person_last_name" => "nullable|string|max:255",
            "legal_person_cni_number" => "nullable|string|max:255|unique:shop_profiles,legal_person_cni_number",
            "contact_person_name" => "nullable|string|max:255",
            "contact_person_number" => "nullable|string|max:255",
            "contact_person_email" => "required|email|max:255|email",
            "contact_phone_number" => "required|string|max:255",
            "description" => "nullable|string|max:1000",
            "address" => "required|string|max:255",
            "apartment" => "nullable|string|max:255",
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
