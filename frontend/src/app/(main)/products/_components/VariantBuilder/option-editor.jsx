"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";

export default function OptionEditor({
    options,
    maxOptions = 3,
    onAddOption,
    onRemoveOption,
    onRenameOption,
    onAddValue,
    onChangeValue,
    onRemoveValue,
    errors,
}) {
    const canAdd = options.length < maxOptions;
    const handleRename = useCallback((id) => (e) => onRenameOption(id, e.target.value), [onRenameOption]);
    const handleChangeValue = useCallback((optId, valId) => (e) => onChangeValue(optId, valId, e.target.value), [onChangeValue]);

    return (
        <section className="rounded-lg border">
            {!options.length && canAdd && (
                <div className="p-4">
                    <button
                        className="w-full h-9 px-3 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-50"
                        onClick={onAddOption}
                    >
                        + Add option
                    </button>
                </div>
            )}

            {!!options.length && (
                <div className="space-y-4">
                    {options.map((opt, index) => (
                        <div key={index}>
                            <div className="px-8">
                                <div className="py-4 space-y-3 w-full">
                                    <div className="space-y-1 w-full">
                                        <div className="flex items-end justify-between">
                                            <Label htmlFor={`opt-${String(opt.id)}`} className="text-sm font-medium">
                                                Option name
                                            </Label>
                                            <button
                                                className="h-8 px-2 rounded-lg border text-sm hover:bg-red-100 flex items-center gap-1"
                                                onClick={() => onRemoveOption(opt.id)}
                                            >
                                                Remove <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <Input
                                            id={`opt-${String(opt.id)}`}
                                            className="w-full h-9 rounded-lg border bg-white px-3 text-sm"
                                            value={opt.name}
                                            onChange={handleRename(opt.id)}
                                            placeholder="Ex: Color"
                                            maxLength={255}
                                            error={errors?.[index]?.name}
                                            showErrorAsTooltip
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm">Option value</Label>
                                        <div className="space-y-2">
                                            {opt.values.map((val) => (
                                                <div key={String(val.id)} className="flex items-center gap-2">
                                                    <Input
                                                        className="flex-1 h-9 rounded-lg border bg-white px-3 text-sm"
                                                        value={val.value}
                                                        onChange={handleChangeValue(opt.id, val.id)}
                                                        placeholder="Ex: Red"
                                                        maxLength={255}
                                                        error={!val.value && errors?.[index]?.values}
                                                    />
                                                    {opt.values.length > 1 && (
                                                        <button
                                                            className="h-9 px-2 rounded-lg border text-sm hover:bg-red-100"
                                                            onClick={() => onRemoveValue(opt.id, val.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                className="h-8 px-2 rounded-lg border text-sm hover:bg-gray-50"
                                                onClick={() => onAddValue(opt.id)}
                                            >
                                                + Add value
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {options.length > 1 && index < options.length - 1 && <hr className="border-t border-gray-200" />}
                        </div>
                    ))}
                    {options?.length < maxOptions && (
                        <button
                            className="w-full h-9 px-3 rounded-lg border-t text-sm hover:bg-gray-50 disabled:opacity-50"
                            onClick={onAddOption}
                        >
                            + Add option
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}
