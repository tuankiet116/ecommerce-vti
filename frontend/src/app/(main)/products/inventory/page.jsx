"use client";

import { DataTable } from "@/components/shared/DataTable";
import DefaultPage from "@/components/shared/DefaultPage";
import DefaultPagination from "@/components/shared/DefaultPagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useBulkUpdateVariants, useGetVariants } from "@/queries/products/useVariants";
import { variantActions } from "@/store/slices/variant-slice";
import { isEqual } from "lodash";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Page() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { data: dataVariants } = useGetVariants(page);
    const bulkUpdateVariants = useBulkUpdateVariants();
    const variants = useSelector((state) => state.variant.variants);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const oldDataVariants = useRef([]);

    const handleChangeAttribute = (index, attribute, value) => {
        dispatch(variantActions.setVariantAttribute({ index, attribute, value }));
    };

    const discardChanges = () => {
        dispatch(variantActions.setVariants(oldDataVariants.current));
    };

    const saveChanges = async () => {
        let data = variants.map((variant) => {
            return {
                id: variant.id,
                sku: variant.sku,
                inventory_quantity: variant.inventory_quantity,
            };
        });
        let result = await bulkUpdateVariants.mutateAsync(data);
        dispatch(variantActions.setVariants(result));
        oldDataVariants.current = result;
        toast.success("Update successfully");
    };

    useEffect(() => {
        if (dataVariants?.data) {
            dispatch(variantActions.setVariants(dataVariants?.data));
            oldDataVariants.current = JSON.parse(JSON.stringify(dataVariants.data));
        }
    }, [dataVariants]);

    useEffect(() => {
        if (isEqual(variants, oldDataVariants.current)) {
            setHasUnsavedChanges(false);
        } else {
            setHasUnsavedChanges(true);
        }
    }, [variants]);

    const columns = useMemo(() => {
        return [
            {
                header: "",
                accessorKey: "images",
                cell: ({ row }) => {
                    let sourceImage = row.original.images?.[0]?.url || row.original.product?.images?.[0]?.url;
                    if (sourceImage) {
                        return (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border">
                                <Image
                                    width={48}
                                    height={48}
                                    src={sourceImage}
                                    alt="Product-variant image"
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                        );
                    }
                    return (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                    );
                },
            },
            {
                accessorKey: "product",
                header: "Product",
                cell: ({ row }) => {
                    return (
                        <div>
                            <p
                                className="mb-2 font-medium cursor-pointer hover:underline"
                                onClick={() => router.push(`/products/${row.original.product_id}`)}
                            >
                                {row.original.product?.name}
                            </p>
                            <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200"
                            >
                                {row.original.name}
                            </Badge>
                        </div>
                    );
                },
            },
            { accessorKey: "sku", header: "SKU", cell: ({ row }) => row.original.sku || "No SKU" },
            {
                accessorKey: "inventory_quantity",
                header: "Inventory quantity",
                cell: ({ row }) => (
                    <Input
                        value={row.original.inventory_quantity}
                        onChange={(e) => handleChangeAttribute(row.index, "inventory_quantity", e.target.value)}
                    />
                ),
            },
        ];
    }, [dataVariants]);

    return (
        <DefaultPage
            hasUnsavedChanges={hasUnsavedChanges}
            onDiscard={discardChanges}
            onSave={saveChanges}
            isSaving={bulkUpdateVariants.isPending}
        >
            <div className="mx-auto max-w-6xl space-y-6 mt-4 mb-4 w-full">
                <div>
                    <h1 className="text-xl font-semibold">Inventory management</h1>
                </div>
                <DataTable columns={columns} data={variants ?? []} />
            </div>
            <DefaultPagination selectedPage={page} totalPage={dataVariants?.last_page} onPageChange={setPage} />
        </DefaultPage>
    );
}
