<?php

namespace App\Http\Controllers;

use App\Enums\ErrorCode;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerProfileRequest;
use App\Http\Requests\Customer\UpdateCustomerAvatarRequest;
use App\Http\Services\CustomerService;
use Knuckles\Scribe\Attributes\ResponseFromFile;

class CustomerController extends Controller
{
    public function __construct(protected CustomerService $customerService) {}

    /**
     * Create a new customer profile.
     *
     * This method handles the creation of a customer profile.
     * @authenticated	
     * @group Profile Customer
     * @param StoreCustomerProfileRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    #[ResponseFromFile("storage/responses/auth/401.json", 401)]
    #[ResponseFromFile("storage/responses/profile/customer/create-customer.200.json", 200)]
    #[ResponseFromFile("storage/responses/profile/customer/create-customer.400.json", 400)]
    #[ResponseFromFile("storage/responses/profile/customer/create-customer.409.json", 409)]
    public function createProfile(StoreCustomerProfileRequest $request)
    {
        $data = $request->validated();
        $customer = $this->customerService->createProfile($data);
        if ($customer instanceof ErrorCode) {
            return $this->responseError($customer);
        }
        return $this->responseSuccess($customer->toArray());
    }

    /**
     * Update the customer profile.
     *
     * This method handles the update of an existing customer profile.
     * @authenticated
     * @group Profile Customer
     * @param StoreCustomerProfileRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    #[ResponseFromFile("storage/responses/auth/401.json", 401)]
    #[ResponseFromFile("storage/responses/profile/customer/get-customer.200.json", 200)]
    #[ResponseFromFile("storage/responses/profile/customer/update-customer.400.json", 400)]
    #[ResponseFromFile("storage/responses/profile/customer/get-customer.404.json", 404)]
    public function updateProfile(StoreCustomerProfileRequest $request)
    {
        $data = $request->validated();
        $customer = $this->customerService->updateProfile($data);
        if ($customer instanceof ErrorCode) {
            return $this->responseError($customer);
        }
        return $this->responseSuccess($customer->toArray());
    }

    /**
     * Update the customer's avatar.
     *
     * This method handles the update of the customer's avatar.
     * @authenticated
     * @group Profile Customer
     * 
     * @param UpdateCustomerAvatarRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    #[ResponseFromFile("storage/responses/auth/401.json", 401)]
    #[ResponseFromFile("storage/responses/profile/customer/get-customer.200.json", 200)]
    #[ResponseFromFile("storage/responses/profile/customer/update-customer.400.json", 400)]
    #[ResponseFromFile("storage/responses/profile/customer/get-customer.404.json", 404)]
    public function updateAvatar(UpdateCustomerAvatarRequest $request)
    {
        $avatarImage = $request->file('avatar');
        $isRemove = $request->input('is_remove', false);
        $customer = $this->customerService->updateAvatar($avatarImage, $isRemove);
        if ($customer instanceof ErrorCode) {
            return $this->responseError($customer);
        }
        return $this->responseSuccess($customer->toArray());
    }

    /**
     * Get the user's customer profile.
     *
     * This method retrieves the customer profile for the authenticated user.
     * @authenticated
     * @group Profile Customer
     * @return \Illuminate\Http\JsonResponse
     */
    #[ResponseFromFile("storage/responses/auth/401.json", 401)]
    #[ResponseFromFile("storage/responses/profile/customer/get-customer.200.json", 200)]
    #[ResponseFromFile("storage/responses/profile/customer/get-customer.404.json", 404)]
    public function getProfile()
    {
        $customer = $this->customerService->getProfile();
        if ($customer instanceof ErrorCode) {
            return $this->responseError($customer, 404);
        }
        return $this->responseSuccess($customer->toArray());
    }
}
