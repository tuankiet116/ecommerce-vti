import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ultils/data-table";
import { SiteHeader } from "@/components/ultils/site-header";
import { useGetShopApprovals, useUpdateShopStatus } from "@/api/useShop";
import { TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import ShopApprovalCollumns from "@/components/shop-approvals/columns";
import ShopDetailSheet from "@/components/shop-approvals/shop-detail-sheet";
import { toast } from "sonner";
import { queryClient } from "@/api";

export default function ShopApprovals() {
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);
    const [openDrawerDetail, setOpenDrawerDetail] = useState(false);
    const [shopDetail, setShopDetail] = useState(null);
    const [status, setStatus] = useState("all");
    const { data: shopData = {}, isLoading } = useGetShopApprovals(status, filter, page);
    const updateShopStatus = useUpdateShopStatus();

    const data = useMemo(() => {
        return [
            {
                value: "all",
                label: "All Shops",
            },
            {
                value: "approved",
                label: "Approved Shops",
            },
            {
                value: "unapproved",
                label: "Under Review Shops",
            },
            {
                value: "suspended",
                label: "Suspended Shops",
            },
            {
                value: "rejected",
                label: "Rejected Shops",
            },
        ];
    }, []);

    const handleOpenDrawerDetail = (shop) => {
        setOpenDrawerDetail(true);
        setShopDetail(shop);
    };

    const handleChangeStatus = async (shopId, status) => {
        await updateShopStatus.mutateAsync({ shopId, status }).catch((err) => toast.error("Update shop status failed."));
        queryClient.invalidateQueries({ queryKey: ["shop-approvals"] });
    };

    return (
        <>
            <SiteHeader title="Shop Approvals" />
            <ShopDetailSheet
                shop={shopDetail}
                open={openDrawerDetail}
                onOpenChange={setOpenDrawerDetail}
                onChangeStatus={handleChangeStatus}
            />
            <div className="p-6">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search..."
                        value={filter}
                        onChange={(event) => setFilter(event.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <Tabs defaultValue="all" className="w-full flex-col justify-start gap-6">
                    <TabsList>
                        {data.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value} onClick={() => setStatus(tab.value)}>
                                {tab.label}
                                {/* {!!tab.data?.total && <Badge variant="secondary">{tab.data.total}</Badge>} */}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {data.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            <DataTable
                                currentPage={page}
                                columns={ShopApprovalCollumns(handleOpenDrawerDetail)}
                                onPageChange={setPage}
                                data={shopData?.data ?? []}
                                isLoading={isLoading}
                                totalPages={shopData?.last_page ?? 1}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </>
    );
}
