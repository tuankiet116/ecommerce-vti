<?php

namespace App\Rules;

use App\Models\ImageModel;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ImageExist implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!isset($value) || !ImageModel::where('uuid', $value)
            ->where('shop_id', request()->user()?->shopProfile?->id)
            ->exists()) {
            $fail("The image with UUID {$value} does not exist or is not associated with the current shop.");
        }
    }
}
