<?php

namespace App\Models;

use App\Http\Ultils\AttributeAccessor;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ShopModel extends Model
{
    protected $table = 'shop_profiles';
    protected $appends = ["legal_person_full_name"];
    protected $fillable = [
        'user_credential_id',
        "handle",
        'shop_name',
        'bussiness_name',
        "bussiness_number",
        "bussiness_tax_number",
        "legal_person_first_name",
        "legal_person_last_name",
        "legal_person_cni_number",
        "contact_person_name",
        "contact_person_email",
        "contact_phone_number",
        "profile_image",
        "banner_image",
        "description",
        "address",
        "apartment",
        "state",
        "city",
        "zip_code",
        "country",
        "status",
        'is_verified',
        'verified_at',
    ];

    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_SUSPENDED = 'suspended';
    const STATUS_REJECTED = 'rejected';

    public function getLegalPersonFullNameAttribute()
    {
        return trim("{$this->legal_person_first_name} {$this->legal_person_last_name}");
    }

    public function user()
    {
        return $this->belongsTo(UserCredentialModel::class, 'user_credential_id');
    }

    public function profileImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => AttributeAccessor::getImageUrl($value),
        );
    }

    public function bannerImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => AttributeAccessor::getImageUrl($value),
        );
    }
}
