import { formatDateTimeToLocale } from "@/helpers/datetime";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import StatusBadge from "./status-badge";
import { STATUS_ACTIVE, STATUS_INACTIVE, STATUS_REJECTED, STATUS_SUSPENDED } from "@/constants/common";
import { useMemo } from "react";

export default function ShopDetailSheet({ shop, open, onOpenChange, onChangeStatus }) {
    const formatAddress = useMemo(() => {
        const parts = [shop?.apartment, shop?.address, shop?.city, shop?.state, shop?.zip_code].filter(Boolean);

        return parts.join(", ");
    }, [shop]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-auto">
                <SheetHeader>
                    <SheetTitle>Shop Profile</SheetTitle>
                    <SheetDescription>View details for {shop?.shop_name}</SheetDescription>
                </SheetHeader>

                <div className="px-4 space-y-6">
                    {/* Profile Info */}
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                            <AvatarFallback>{shop?.legal_person_full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-lg font-semibold">{shop?.legal_person_full_name}</p>
                            <p className="text-sm text-muted-foreground">{shop?.contact_person_email}</p>
                            <p className="text-sm text-muted-foreground">{shop?.contact_phone_number}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Shop Info */}
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Shop Info</h3>
                        <div className="mt-2 space-y-1">
                            <p>
                                <strong>Shop Name:</strong> {shop?.shop_name}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Company Info */}
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Company Info</h3>
                        <div className="mt-2 space-y-1">
                            <p>
                                <strong>Business Name:</strong> {shop?.bussiness_name}
                            </p>
                            <p>
                                <strong>Business Number:</strong> {shop?.bussiness_number}
                            </p>
                            <p>
                                <strong>Tax number:</strong> {shop?.bussiness_tax_number}
                            </p>
                            <p>
                                <strong>Description:</strong> {shop?.description}
                            </p>
                        </div>
                    </div>

                    <Separator />
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Company Representative</h3>
                        <div className="mt-2 space-y-1">
                            <p>
                                <strong>First name:</strong> {shop?.legal_person_first_name}
                            </p>
                            <p>
                                <strong>Last name:</strong> {shop?.legal_person_last_name}
                            </p>
                            <p>
                                <strong>CNI Number:</strong> {shop?.legal_person_cni_number}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Location */}
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                        <div className="mt-2 space-y-1">
                            <p>{formatAddress}</p>
                            <p>{shop?.country}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Metadata */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <StatusBadge status={shop?.status} />
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                            <p>Created: {formatDateTimeToLocale(shop?.created_at)}</p>
                            <p>Updated: {formatDateTimeToLocale(shop?.updated_at)}</p>
                        </div>
                    </div>
                </div>
                <SheetFooter className="flex justify-end">
                    {shop?.status !== STATUS_ACTIVE && (
                        <Button onClick={() => onChangeStatus(shop.id, STATUS_ACTIVE)} className="cursor-pointer">
                            Approve Shop
                        </Button>
                    )}
                    {shop?.status === STATUS_INACTIVE && (
                        <Button variant="destructive" onClick={() => onChangeStatus(shop.id, STATUS_REJECTED)} className="cursor-pointer">
                            Reject Shop
                        </Button>
                    )}
                    {shop?.status === STATUS_ACTIVE && (
                        <Button variant="secondary" onClick={() => onChangeStatus(shop.id, STATUS_SUSPENDED)} className="cursor-pointer">
                            Suspend Shop
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
