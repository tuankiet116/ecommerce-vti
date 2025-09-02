<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'description'    => $this->description,
            'is_active'      => $this->is_active,
            'category_id'    => $this->category_id,
            'categories'     => $this->categories,
            'collection_ids' => $this->collections->pluck('id'),
            'images' => $this->images->map(fn($img) => [
                'uuid'     => $img->uuid,
                'url'      => $img->url,
            ]),

            'options' => OptionResource::collection($this->options),
            'variants' => VariantResource::collection($this->variants),
        ];
    }
}
