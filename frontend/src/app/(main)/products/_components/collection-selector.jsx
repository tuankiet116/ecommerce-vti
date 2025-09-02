import { MultiSelect } from "@/components/shared/MultiSelect";
import { Label } from "@/components/ui/label";
import { useGetCollections } from "@/queries/products/useCollections";
import { use, useEffect, useMemo, useRef, useState } from "react";

export default function CollectionsSelector({ selectedCollections = [], handleChangeCollections }) {
    const [searchValue, setSearchValue] = useState("");
    const { data: collections } = useGetCollections(searchValue, null);
    const [selected, setSelected] = useState([]);
    const optionCollections = useMemo(() => {
        console.log("Collections data:", collections);
        return collections?.data?.map((collection) => {
            return {
                id: collection.id,
                value: collection.id,
                label: collection.name,
            };
        }) || [];
    }, [collections]);

    useEffect(() => {
        setSelected(optionCollections.filter((option) => selectedCollections.includes(option.id)));
    }, [optionCollections, selectedCollections]);

    return (
        <div>
            <Label className="text-sm font-medium mb-2">Collections</Label>
            <MultiSelect
                options={optionCollections}
                selected={selected}
                searchPlaceholder="Select collections"
                className="w-full shadow-none text-muted-foreground text-md mt-0"
                onSearch={setSearchValue}
                onSelectionChange={(selected) => handleChangeCollections(selected.map((item) => item.id))}
            />
        </div>
    );
}
