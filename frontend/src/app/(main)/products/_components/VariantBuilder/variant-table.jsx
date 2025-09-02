"use client";

import ImageLibrary from "@/components/shared/ImageLibrary";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export default function VariantTable({ rows, onFieldChange, removeVariants, errors }) {
    const [openImageLib, setOpenImageLib] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState(new Set());
    const [isRemoving, setIsRemoving] = useState(false);

    const isSelectedAll = useMemo(() => selectedVariants.size === rows.length && rows.length > 0, [selectedVariants, rows.length]);

    function handleSelectAll() {
        if (isSelectedAll) {
            setSelectedVariants(new Set());
        } else {
            const newSet = new Set(rows.map((r) => r.key));
            setSelectedVariants(newSet);
        }
    }

    function handleSelectVariant(variant) {
        setSelectedVariants((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(variant.key)) {
                newSet.delete(variant.key);
            } else {
                newSet.add(variant.key);
            }
            return newSet;
        });
    }

    async function handleRemoveVariants() {
        if (selectedVariants.size === 0) return;

        setIsRemoving(true);
        try {
            await removeVariants(selectedVariants);
            setSelectedVariants(new Set()); // Clear selection after removal
        } catch (error) {
            console.error("Error removing variants:", error);
        } finally {
            setIsRemoving(false);
        }
    }

    return (
        <section className="rounded border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                <h2 className="font-medium">Variants ({rows.length})</h2>
                {selectedVariants.size > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{selectedVariants.size} selected</span>
                        <button
                            className="h-8 px-3 rounded border text-sm bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                            onClick={handleRemoveVariants}
                            disabled={isRemoving}
                        >
                            {isRemoving ? "Removing..." : "Remove"}
                        </button>
                    </div>
                )}
            </div>

            {rows.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    <p>No variants available.</p>
                    <p className="text-sm mt-1">Add options above to generate variants.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="w-12 p-3" width="5%">
                                    <input type="checkbox" checked={isSelectedAll} onChange={handleSelectAll} className="rounded" />
                                </th>
                                <th className="text-center p-3 font-medium text-sm" width="10%">
                                    Image
                                </th>
                                <th className="text-left p-3 font-medium text-sm" width="20%">
                                    Variant
                                </th>
                                <th className="text-left p-3 font-medium text-sm" width="15%">
                                    SKU
                                </th>
                                <th className="text-left p-3 font-medium text-sm" width="15%">
                                    Price
                                </th>
                                <th className="text-left p-3 font-medium text-sm" width="15%">
                                    Compare at
                                </th>
                                <th className="text-left p-3 font-medium text-sm" width="15%">
                                    Inventory
                                </th>
                                <th className="text-left p-3 font-medium text-sm" width="10%">
                                    Active
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.key} className="border-b hover:bg-gray-50">
                                    <td className="flex items-center justify-center pt-5">
                                        <input
                                            type="checkbox"
                                            checked={selectedVariants.has(row.key)}
                                            onChange={() => handleSelectVariant(row)}
                                            className="rounded"
                                        />
                                    </td>
                                    <td>
                                        <div className="w-full flex items-center justify-center">
                                            <div
                                                className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors w-12"
                                                onClick={() => setOpenImageLib(true)}
                                            >
                                                {row.fields.images?.length > 0 ? (
                                                    <img
                                                        src={row.fields.images[0].url}
                                                        alt={row.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = "/placeholder.svg"; // Fallback image
                                                        }}
                                                    />
                                                ) : (
                                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <ImageLibrary
                                                open={openImageLib}
                                                onOpenChange={setOpenImageLib}
                                                isMultiple={false}
                                                onSelectImage={(images) => onFieldChange(row.key, { images: images })}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="font-medium text-xs">{row.name}</div>
                                    </td>
                                    <td className="p-3">
                                        <Input
                                            className="w-full h-9 rounded border bg-white px-3 text-sm"
                                            placeholder="SKU"
                                            value={row.fields.sku}
                                            maxLength={10}
                                            onChange={(e) => onFieldChange(row.key, { sku: e.target.value })}
                                            showErrorAsTooltip
                                        />
                                    </td>
                                    <td className="p-3">
                                        <Input
                                            className="w-full h-9 rounded border bg-white px-3 text-sm"
                                            type="number"
                                            placeholder="0.00"
                                            value={row.fields.price}
                                            onChange={(e) => onFieldChange(row.key, { price: e.target.value })}
                                            error={errors?.[index]?.price}
                                            showErrorAsTooltip
                                        />
                                    </td>
                                    <td className="p-3">
                                        <Input
                                            className="w-full h-9 rounded border bg-white px-3 text-sm"
                                            type="number"
                                            placeholder="0.00"
                                            value={row.fields.compare_at_price}
                                            onChange={(e) => onFieldChange(row.key, { compare_at_price: e.target.value })}
                                            error={errors?.[index]?.compare_at_price}
                                            showErrorAsTooltip
                                        />
                                    </td>
                                    <td className="p-3">
                                        <Input
                                            className="w-full h-9 rounded border bg-white px-3 text-sm"
                                            type="number"
                                            min="0"
                                            placeholder={row.fields.inventory_quantity}
                                            value={row.fields.inventory_quantity}
                                            onChange={(e) => onFieldChange(row.key, { inventory_quantity: Number(e.target.value || 0) })}
                                            error={errors?.[index]?.inventory_quantity}
                                            showErrorAsTooltip
                                        />
                                    </td>
                                    <td className="flex items-center justify-center pt-5">
                                        <Input
                                            type="checkbox"
                                            className="h-4 w-4 rounded"
                                            defaultChecked={row.fields.is_active ?? true}
                                            onChange={(e) => onFieldChange(row.key, { is_active: e.target.checked })}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
