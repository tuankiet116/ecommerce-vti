<?php

namespace App\Models;

use App\Http\Ultils\AttributeAccessor;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class CustomerModel extends Model
{
    protected $table = 'customer_profiles';

    protected $fillable = [
        "first_name",
        "last_name",
        "phone_number",
        "photo",
        "user_credential_id",
        "dob",
        "gender",
    ];

    public function user()
    {
        return $this->belongsTo(UserCredentialModel::class, 'user_credential_id');
    }

    public function photo(): Attribute
    {
        return Attribute::make(
            get: fn($value) => AttributeAccessor::getImageUrl($value),
        );
    }
}
