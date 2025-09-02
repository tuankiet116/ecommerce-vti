<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'price' => $this->price,
            'compare_at_price' => $this->compare_at_price,
            'inventory_quantity' => $this->inventory_quantity,
            'is_default' => $this->is_default,
            'is_active' => $this->is_active,
            'option_values' => $this->options,
            'images' => $this->images->map(fn($img) => [
                'uuid'     => $img->uuid,
                'url'      => $img->url,
            ]),
        ];
    }
}
