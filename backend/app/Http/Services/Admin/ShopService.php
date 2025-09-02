<?php

namespace App\Http\Services\Admin;

use App\Mail\Shop\MailUpdateStatus;
use App\Models\ShopModel;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Mail;

class ShopService
{
    public function getList(Request $request)
    {
        $query = ShopModel::query();
        if ($request->has("status")) {
            switch ($request->get("status")) {
                case "approved":
                    $query->where('status', ShopModel::STATUS_ACTIVE);
                    break;
                case "unapproved":
                    $query->where('status', ShopModel::STATUS_INACTIVE);
                    break;
                case "suspended":
                    $query->where('status', ShopModel::STATUS_SUSPENDED);
                    break;
                case "rejected":
                    $query->where('status', ShopModel::STATUS_REJECTED);
                    break;
                default:
                    break;
            }
        }
        if ($request->has('search')) {
            $search = $request->input('search');
            return $query->where(function (Builder $query) use ($search) {
                $query->where('bussiness_name', 'ilike', "%{$search}%")
                    ->orWhere('contact_person_email', 'ilike', "%{$search}%");
            })->paginate(20);
        }
        return $query->paginate(20);
    }

    public function updateStatus(int $shopId, string $status)
    {
        try {
            $shop = ShopModel::findOrFail($shopId);
            $shop->status = $status;
            $shop->save();
            Mail::to($shop->contact_person_email)->send(new MailUpdateStatus($shop));
        } catch (\Exception $e) {
            throw new \Exception("(Admin) Failed to update shop status: " . $e->getMessage());
        }
    }
}
