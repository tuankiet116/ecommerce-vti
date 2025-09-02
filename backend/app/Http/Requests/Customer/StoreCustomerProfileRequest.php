<?php

namespace App\Http\Requests\Customer;

use App\Http\Requests\BaseFormRequest;

class StoreCustomerProfileRequest extends BaseFormRequest
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
            "first_name" => "required|string|max:255",
            "last_name" => "required|string|max:255",
            "phone_number" => "required|string|max:255",
            "dob" => "required|date_format:Y-m-d",
            "gender" => "required|string",
        ];
    }
}
