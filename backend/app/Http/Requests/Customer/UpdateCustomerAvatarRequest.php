<?php

namespace App\Http\Requests\Customer;

use App\Http\Requests\BaseFormRequest;

/**
 * @bodyParam avatar file required The avatar image file. Required if is_remove is false. Max size 2MB. Must be jpeg, png, jpg, gif, or svg.
 * @bodyParam is_remove boolean Whether to remove the current avatar.
 */
class UpdateCustomerAvatarRequest extends BaseFormRequest
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
            "avatar" => "required_without:is_remove|required_if:is_remove,false|image|mimes:jpeg,png,jpg,gif,svg|max:2048",
            "is_remove" => "nullable|boolean",
        ];
    }
}
