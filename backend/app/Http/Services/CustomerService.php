<?php

namespace App\Http\Services;

use App\Enums\ErrorCode;
use App\Models\CustomerModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Storage;

class CustomerService
{
    public function getProfile(): ErrorCode|CustomerModel
    {
        $userId = Auth::id();
        $customerProfile = CustomerModel::with(['user:id,email'])->where('user_credential_id', $userId)->first();
        if (!$customerProfile) {
            return ErrorCode::PROFILE_NOT_FOUND;
        }
        return $customerProfile;
    }

    public function createProfile($data): ErrorCode|CustomerModel
    {
        try {
            $userId = Auth::id();
            if (CustomerModel::where('user_credential_id', $userId)->exists()) {
                Log::warning('Profile already exists for user ID: ' . $userId);
                return ErrorCode::PROFILE_DUPLICATE;
            }

            $customerData = array_merge(['user_credential_id' => $userId], $data);
            $customer = CustomerModel::create($customerData);
            if (!$customer) return ErrorCode::PROFILE_CREATION_FAILED;
            $customer->load('user:id,email');

            return $customer;
        } catch (\Exception $e) {
            Log::error('Create profile error: ' . $e->getMessage());
            return ErrorCode::PROFILE_CREATION_FAILED;
        }
    }

    public function updateProfile($data): ErrorCode|CustomerModel
    {
        try {
            $userId = Auth::id();
            $customer = CustomerModel::where('user_credential_id', $userId)->first();
            if (!$customer) {
                return ErrorCode::PROFILE_NOT_FOUND;
            }
            $customer->update($data);
            $customer->load('user:id,email');

            return $customer;
        } catch (\Exception $e) {
            Log::error('Update profile error: ' . $e->getMessage());
            return ErrorCode::PROFILE_UPDATE_FAILED;
        }
    }

    public function updateAvatar($avatarImage, $isRemove): ErrorCode|CustomerModel
    {
        try {
            $userId = Auth::id();
            $customer = CustomerModel::where('user_credential_id', $userId)->first();
            if (!$customer) {
                return ErrorCode::PROFILE_NOT_FOUND;
            }

            if ($customer->getRawOriginal('photo')) {
                Storage::delete($customer->getRawOriginal('photo'));
            }

            if ($isRemove) {
                $customer->photo = null;
            } else {
                $customer->photo = Storage::putFile('avatars/customers', $avatarImage, 'public');
            }
            $customer->save();
            $customer->load('user:id,email');

            return $customer;
        } catch (\Exception $e) {
            Log::error('Update customer avatar error: ' . $e->getMessage());
            return ErrorCode::PROFILE_UPDATE_FAILED;
        }
    }
}
