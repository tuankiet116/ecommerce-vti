"use client";

import { DataTable } from "@/components/shared/DataTable";
import DefaultPagination from "@/components/shared/DefaultPagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useBulkDeleteProducts, useBulkUpdateStatus, useGetProducts, useGetStatisticsProduct } from "@/queries/products/useProducts";
import { Loader2, Search, Plus, Package, Eye, Edit } from "lucide-react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare } from "lucide-react";
import { Trash2 } from "lucide-react";
import ModalConfirm from "./_components/modal-confirm";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useNavigation from "@/hooks/use-navigation";

export default function Page({}) {
    const router = useNavigation();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(null);
    const [page, setPage] = useState(1);

    const [updatingActiveStatus, setUpdatingActiveStatus] = useState(false);
    const [updatingInactiveStatus, setUpdatingInactiveStatus] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const queryClient = useQueryClient();
    const { data: dataProducts, isLoading: isLoadingProducts } = useGetProducts(search, status, page);
    const { data: dataStatistics } = useGetStatisticsProduct();
    const bulkUpdateStatus = useBulkUpdateStatus();
    const bulkDelete = useBulkDeleteProducts();

    const handleSelectAll = (checked) => {
        if (checked) {
            const allProductIds = dataProducts?.data?.map((product) => product.id) || [];
            setSelectedProducts(allProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (productId, checked) => {
        if (checked) {
            setSelectedProducts((prev) => [...prev, productId]);
        } else {
            setSelectedProducts((prev) => prev.filter((id) => id !== productId));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) return;
        try {
            await bulkDelete.mutateAsync({ ids: selectedProducts });

            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["statistics-product"] });

            setSelectedProducts([]);
            toast.success("Products deleted successfully");
        } catch (error) {
            console.error("Failed to delete products:", error);
            toast.error("Failed to delete products");
        }
        setOpenModalDelete(false);
    };

    const handleBulkStatusUpdate = async (newStatus) => {
        if (selectedProducts.length === 0) return;

        if (newStatus) setUpdatingActiveStatus(true);
        else setUpdatingInactiveStatus(true);
        try {
            await bulkUpdateStatus.mutateAsync({ ids: selectedProducts, isActive: newStatus });

            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["statistics-product"] });

            setSelectedProducts([]);
            toast.success("Products status updated successfully");
        } catch (error) {
            console.error("Failed to update products status:", error);
            toast.error("Failed to update products status");
        }
        if (newStatus) setUpdatingActiveStatus(false);
        else setUpdatingInactiveStatus(false);
    };

    const collumns = useMemo(() => {
        const allProductIds = dataProducts?.data?.map((product) => product.id.toString()) || [];
        const isAllSelected = allProductIds.length > 0 && selectedProducts.length === allProductIds.length;
        const isIndeterminate = selectedProducts.length > 0 && selectedProducts.length < allProductIds.length;

        return [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all products"
                        className={isIndeterminate ? "data-[state=checked]:bg-blue-500" : ""}
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={selectedProducts.includes(row.original.id)}
                        onCheckedChange={(checked) => handleSelectProduct(row.original.id, checked)}
                        aria-label={`Select product ${row.original.name}`}
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "images",
                header: "",
                cell: ({ row }) => {
                    if (row.original.images?.length) {
                        return (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border">
                                <Image
                                    src={row.original.images[0]?.url}
                                    width={48}
                                    height={48}
                                    alt="Product image"
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
                accessorKey: "name",
                header: "Product Name",
                cell: ({ row }) => {
                    return (
                        <div className="space-y-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100">{row.original.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">ID: {row.original.id}</div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "description",
                header: "Description",
                cell: ({ row }) => {
                    return (
                        <div className="max-w-xs">
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {row.original.description || "No description available"}
                            </p>
                        </div>
                    );
                },
            },
            {
                accessorKey: "inventory",
                header: <div className="text-center">Stock</div>,
                cell: ({ row }) => {
                    const inventory = row.original.inventory;
                    const isLowStock = inventory < 5;
                    const isOutOfStock = inventory === 0;

                    return (
                        <div className="text-center">
                            <div
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                    isOutOfStock
                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        : isLowStock
                                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                }`}
                            >
                                <Package className="w-3 h-3 mr-1" />
                                {inventory}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "category",
                header: "Category",
                cell: ({ row }) => {
                    return (
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            {row.original.category?.name || <span className="text-gray-400 italic">Uncategorized</span>}
                        </div>
                    );
                },
            },
            {
                accessorKey: "is_active",
                header: "Status",
                cell: ({ row }) =>
                    row.original.is_active ? (
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
                    ),
            },
            {
                accessorKey: "actions",
                header: "",
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-50 hover:text-gray-600"
                                onClick={() => router.push(`/products/${row.original.id}`)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
            },
        ];
    }, [router, selectedProducts, dataProducts?.data]);

    const handleChangeTab = (tab) => {
        switch (tab) {
            case "inactive":
                setStatus(false);
                break;
            case "active":
                setStatus(true);
                break;
            case "all":
                setStatus(null);
                break;
        }
    };

    const totalProducts = dataStatistics?.data?.total || 0;
    const activeProducts = dataStatistics?.data?.active || 0;
    const inactiveProducts = dataStatistics?.data?.inactive || 0;

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your product inventory and details</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={() => router.push("/products/new")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalProducts}</p>
                            </div>
                            <Package className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Products</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeProducts}</p>
                            </div>
                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-gray-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Draft Products</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{inactiveProducts}</p>
                            </div>
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <div className="h-4 w-4 bg-gray-500 rounded-full"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                className="pl-10 w-full sm:w-80"
                                type="text"
                                value={search}
                                placeholder="Search products..."
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Tabs onValueChange={handleChangeTab} defaultValue="all" className="w-full sm:w-auto">
                            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                                <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                    All ({totalProducts})
                                </TabsTrigger>
                                <TabsTrigger value="active" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                                    Active ({activeProducts})
                                </TabsTrigger>
                                <TabsTrigger value="inactive" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white">
                                    Draft ({inactiveProducts})
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            {selectedProducts.length > 0 && (
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckSquare className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-blue-900 dark:text-blue-100">
                                    {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""} selected
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkStatusUpdate(true)}
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                    disabled={updatingActiveStatus || updatingInactiveStatus || bulkDelete.isPending}
                                >
                                    {updatingActiveStatus ? (
                                        <>
                                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Mark as Active"
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkStatusUpdate(false)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                    disabled={updatingActiveStatus || updatingInactiveStatus || bulkDelete.isPending}
                                >
                                    {updatingInactiveStatus ? (
                                        <>
                                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Mark as Draft"
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setOpenModalDelete(true)}
                                    className="border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedProducts([])}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Data Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoadingProducts ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-500" />
                            <span className="text-gray-600 dark:text-gray-400">Loading products...</span>
                        </div>
                    ) : (
                        <DataTable data={dataProducts?.data ?? []} columns={collumns} />
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <DefaultPagination selectedPage={page} totalPage={dataProducts?.last_page} onPageChange={setPage} />
            </div>
            <ModalConfirm
                open={openModalDelete}
                header="Delete products"
                onOpenChange={setOpenModalDelete}
                buttonConfirmText="Delete"
                buttonConfirmVariant="destructive"
                onConfirm={() => handleBulkDelete()}
                isLoading={bulkDelete.isPending}
            >
                Are you sure to delete {selectedProducts.length} products? This action cannot be undone.
            </ModalConfirm>
        </div>
    );
}
