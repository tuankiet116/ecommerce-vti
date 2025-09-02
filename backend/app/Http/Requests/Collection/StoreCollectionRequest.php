<?php

namespace App\Http\Requests\Collection;

use App\Http\Requests\BaseFormRequest;
use Auth;
use Illuminate\Database\Query\Builder;
use Illuminate\Validation\Rule;
use Str;

class StoreCollectionRequest extends BaseFormRequest
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
        $shopId = Auth::check() ? app("my_shop_profile")?->id : null;
        return [
            "name" => "required|string|max:255",
            "description" => "nullable|string",
            "is_active" => "nullable|boolean",
            "slug" => ["nullable", "string", "max:255", Rule::unique("collections")->where(function (Builder $query) use ($shopId) {
                if ($this->method() === 'PUT') {
                    $query->where('id', '!=', $this->route('collectionId'));
                }
                return $query->where("shop_id", $shopId);
            })],
        ];
    }

    public function prepareForValidation() {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }
}
