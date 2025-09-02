export function rid(prefix = "tmp") {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function normalizeOptions(input) {
    return (input || []).map((option) => ({
        id: option.id ?? rid("opt"),
        name: option.name ?? "",
        values: (option.option_value || []).map((v) => {
            return {
                id: v.id ?? rid("val"),
                product_option_id: option.id ?? rid("opt"),
                value: v.value ?? "",
            };
        }),
    }));
}

export function comboKey(cells) {
    if (!cells || cells.length === 0) return "default";
    return cells.map((c) => `${c.optionId}:${c.valueId}`).join("|");
}

export function comboName(cells) {
    if (!cells || cells.length === 0) return "Default";
    return cells.map((c) => c.valueLabel).join(" / ");
}

export function cartesianFromOptions(options) {
    if (!options || options.length === 0) return [{ key: "default", cells: [] }];
    const lists = options.map((opt) =>
        (opt.values || []).map((v) => ({
            optionId: opt.id,
            optionName: opt.name,
            valueId: v.id,
            valueLabel: v.value,
        })),
    );
    const seed = [[]];
    const prod = lists.reduce((acc, arr) => {
        const next = [];
        acc.forEach((a) => arr.forEach((b) => next.push([...a, b])));
        return next;
    }, seed);
    return prod.map((cells) => ({ key: comboKey(cells), cells }));
}

export function stableStringify(obj) {
    return JSON.stringify(obj, (key, value) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            const sorted = {};
            Object.keys(value)
                .sort()
                .forEach((k) => {
                    sorted[k] = value[k];
                });
            return sorted;
        }
        return value;
    });
}
