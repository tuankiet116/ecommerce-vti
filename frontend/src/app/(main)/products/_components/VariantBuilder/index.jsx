"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import OptionEditor from "./option-editor";
import VariantTable from "./variant-table";
import { cartesianFromOptions, comboName, normalizeOptions, stableStringify } from "../../_lib/variant-utils";

export default function VariantBuilder({
    initialOptions,
    initialVariants = [],
    maxOptions = 3,
    onChangeOptions,
    onChangeVariants,
    errors,
}) {
    const [options, setOptions] = useState(normalizeOptions(initialOptions || []));
    const [deletedVariantKeys, setDeletedVariantKeys] = useState(new Set());

    useEffect(() => {
        if (options.length === 0) {
            setOptions(normalizeOptions(initialOptions || []));
        }
    }, [initialOptions]);

    // Index các variant có sẵn theo key để giữ dữ liệu
    const optionOrder = useMemo(() => options.map((o) => o.id), [options]);

    const existingIndexVariant = useMemo(() => {
        const map = new Map();
        initialVariants.forEach((variant) => {
            const byOpt = new Map();
            (variant.options || []).forEach((o) => byOpt.set(o.product_option_id, o));
            const cells = optionOrder
                .map((optId) => byOpt.get(optId))
                .filter(Boolean)
                .map((o) => ({
                    optionId: o.product_option_id,
                    optionName: "",
                    valueId: o.pivot.product_option_value_id,
                    valueLabel: o.value,
                }));
            const key = cells.length ? cells.map((c) => `${c.optionId}:${c.valueId}`).join("|") : "default";
            map.set(key, variant);
        });
        return map;
    }, [initialVariants, optionOrder]);

    // Generate combos
    const combos = useMemo(() => cartesianFromOptions(options), [options]);
    // Editable fields per row
    const [fieldMap, setFieldMap] = useState({});
    console.log("Field map:", fieldMap);

    // Row model - filter out deleted variants
    const rows = useMemo(() => {
        return combos
            .filter((combo) => !deletedVariantKeys.has(combo.key))
            .map((combo) => {
                let existVariant = structuredClone(existingIndexVariant.get(combo.key)) || {};
                let field = Object.assign(existVariant, fieldMap[combo.key] || {});

                return {
                    key: combo.key,
                    name: comboName(combo.cells),
                    cells: combo.cells,
                    fields: {
                        price: Number(field?.price ?? 0),
                        compare_at_price: Number(field?.compare_at_price ?? 0),
                        inventory_quantity: Number(field?.inventory_quantity ?? 0),
                        is_active: field?.is_active ?? true,
                        images: field?.images || [],
                        sku: field?.sku ?? "",
                    },
                    fromExistingId: field?.id,
                    is_default: field?.is_default ?? false,
                };
            });
    }, [combos, existingIndexVariant, fieldMap, deletedVariantKeys]);

    // Compose outgoing payload
    const payload = useMemo(() => {
        const variants = rows.map((row) => {
            const field = fieldMap[row.key] || {};
            let optionValues = [];
            if (row.cells.length) {
                optionValues = row.cells.map((cell) => {
                    return {
                        option: cell.optionName,
                        value: cell.valueLabel,
                    };
                });
            }

            return {
                id: row.fromExistingId,
                name: row.name,
                sku: field.sku ?? row.fields.sku ?? "",
                price: Number(field.price ?? row.fields.price ?? 0),
                compare_at_price: Number(field.compare_at_price ?? row.fields.compare_at_price ?? 0),
                inventory_quantity: Number(field.inventory_quantity ?? row.fields.inventory_quantity ?? 0),
                is_active: typeof field.is_active === "boolean" ? field.is_active : (row.fields.is_active ?? true),
                is_default: false,
                option_values: optionValues,
                images: field.images ?? row.fields.images ?? [],
            };
        });

        const formattedOptions = options.map((opt) => ({
            id: opt.id,
            name: opt.name,
            values: opt.values.map((v) => v.value),
        }));
        return { options: formattedOptions, variants };
    }, [rows, fieldMap, options]);

    // Guarded onChange
    const lastSent = useRef("");
    useEffect(() => {
        if (!onChangeOptions || !onChangeVariants) return;
        const s = stableStringify(payload);
        if (s !== lastSent.current) {
            lastSent.current = s;
            onChangeOptions(payload.options);
            onChangeVariants(payload.variants);
        }
    }, [payload, onChangeOptions, onChangeVariants]);

    // Option handlers
    function onAddOption() {
        if (options.length >= maxOptions) return;
        const id = `opt_${Math.random().toString(36).slice(2, 9)}`;
        setOptions((prev) => [
            ...prev,
            {
                id,
                name: `Option ${prev.length + 1}`,
                values: [{ id: `val_${Math.random().toString(36).slice(2, 9)}`, product_option_id: id, value: "" }],
            },
        ]);
    }

    function onRemoveOption(id) {
        setOptions((prev) => prev.filter((o) => o.id !== id));
    }

    function onRenameOption(id, name) {
        setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, name } : o)));
    }

    function onAddValue(optionId) {
        setOptions((prev) =>
            prev.map((o) =>
                o.id === optionId
                    ? {
                          ...o,
                          values: [
                              ...o.values,
                              { id: `val_${Math.random().toString(36).slice(2, 9)}`, product_option_id: optionId, value: "" },
                          ],
                      }
                    : o,
            ),
        );
    }

    function onChangeValue(optionId, valueId, value) {
        setOptions((prev) =>
            prev.map((o) => (o.id === optionId ? { ...o, values: o.values.map((v) => (v.id === valueId ? { ...v, value } : v)) } : o)),
        );
    }

    function onRemoveValue(optionId, valueId) {
        setOptions((prev) => prev.map((o) => (o.id === optionId ? { ...o, values: o.values.filter((v) => v.id !== valueId) } : o)));
    }

    function removeVariants(keys) {
        const keysArray = Array.from(keys);

        // Add confirmation dialog
        const confirmed = window.confirm(`Are you sure you want to remove ${keysArray.length} variant${keysArray.length > 1 ? "s" : ""}?`);

        if (!confirmed) return Promise.resolve();

        // Add keys to deleted set
        setDeletedVariantKeys((prev) => new Set([...prev, ...keysArray]));

        // Remove from fieldMap to clean up
        setFieldMap((prev) => {
            const newFieldMap = { ...prev };
            keysArray.forEach((key) => {
                delete newFieldMap[key];
            });
            return newFieldMap;
        });

        return Promise.resolve();
    }

    return (
        <div className="grid gap-6">
            <OptionEditor
                options={options}
                maxOptions={maxOptions}
                onAddOption={onAddOption}
                onRemoveOption={onRemoveOption}
                onRenameOption={onRenameOption}
                onAddValue={onAddValue}
                onChangeValue={onChangeValue}
                onRemoveValue={onRemoveValue}
                errors={errors?.options}
            />
            <VariantTable
                rows={rows}
                onFieldChange={(key, patch) =>
                    setFieldMap((prev) => {
                        return { ...prev, [key]: { ...prev[key], ...patch } };
                    })
                }
                removeVariants={removeVariants}
                errors={errors?.variants}
            />
        </div>
    );
}
