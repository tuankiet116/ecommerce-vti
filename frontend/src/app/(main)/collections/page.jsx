"use client";

import { DataTable } from "@/components/shared/DataTable";
import DefaultPagination from "@/components/shared/DefaultPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useNavigation from "@/hooks/use-navigation";
import { useDeleteCollection, useGetCollections } from "@/queries/products/useCollections";
import { Edit, Package, Trash2 } from "lucide-react";
import { useState } from "react";
import ModalConfirm from "../products/_components/modal-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Page() {
    const queryClient = useQueryClient();
    const deleteCollection = useDeleteCollection();
    const [page, setPage] = useState(1);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [collectionIdToDelete, setcollectionIdToDelete] = useState(null);
    const { data: dataCollections } = useGetCollections("", null, page);
    const router = useNavigation();

    const handleDeleteCollection = async (id) => {
        try {
            await deleteCollection.mutateAsync(id);
            toast.success("Collection deleted");
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            setOpenModalDelete(false);
            setcollectionIdToDelete(null);
        } catch (error) {
            if (error?.status === HttpStatusCode.Forbidden) {
                toast.error("You do not have permission to delete this collection.");
            } else if (error?.status === HttpStatusCode.NotFound) {
                toast.error("Collection not found or already deleted.");
            } else {
                toast.error("An error occurred while deleting the collection. Please try again.");
            }
            return;
        }
    };

    const collumns = [
        {
            accessorKey: "",
            header: "#",
            cell: ({ row }) => {
                let perPage = dataCollections?.per_page || 0;
                let currentIndex = page * perPage - perPage + row.index + 1;
                return <div>{currentIndex}</div>;
            },
        },
        { accessorKey: "name", header: "Title" },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="max-w-xs">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {row.original.description || "No description available"}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "countProduct",
            header: <div className="text-center">Products</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <div
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}
                    >
                        <Package className="w-3 h-3 mr-1" />
                        {row.original.products_count ?? 0}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "is_active",
            header: <div className="text-center">Status</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.is_active ? (
                        <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                            Active
                        </Badge>
                    ) : (
                        <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        >
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></div>
                            Draft
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "actions",
            header: "",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-end gap-2">
                        <div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600"
                                onClick={() => router.push(`/collections/${row.original.id}`)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600"
                                onClick={() => {
                                    setcollectionIdToDelete(row.original.id);
                                    setOpenModalDelete(true);
                                }}
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </div>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-4">
            <div className="flex items-center justify-end mb-4">
                <Button className="text-sm" onClick={() => router.push("/collections/new")}>
                    Create collection
                </Button>
            </div>
            <DataTable data={dataCollections?.data ?? []} columns={collumns} />
            <DefaultPagination selectedPage={page} totalPage={dataCollections?.last_page} onPageChange={setPage} />
            <ModalConfirm
                open={openModalDelete}
                header={"Delete collection"}
                buttonConfirmText={"Delete"}
                buttonConfirmVariant={"destructive"}
                onOpenChange={setOpenModalDelete}
                onConfirm={() => handleDeleteCollection(collectionIdToDelete)}
                isLoading={deleteCollection.isPending}
            >
                <p>Are you sure you want to delete this collection? </p>
                <p>This action cannot be undone.</p>
            </ModalConfirm>
        </div>
    );
}
