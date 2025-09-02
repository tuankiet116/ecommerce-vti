import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { formatDateTimeToLocale } from "@/helpers/datetime";
import StatusBadge from "./status-badge";

export default function ShopApprovalCollumns(openDrawerDetail) {
    const navigate = useNavigate();
    return [
        {
            header: <div className="px-4">Shop name</div>,
            accessorKey: "shop_name",
            cell: ({ row }) => {
                const shopName = row.getValue("shop_name");
                return (
                    <Button variant="link" className="cursor-pointer text-black" onClick={() => openDrawerDetail(row.original)}>
                        {shopName}
                    </Button>
                );
            },
        },
        {
            header: "Bussiness name",
            accessorKey: "bussiness_name",
        },
        {
            header: "Email",
            accessorKey: "contact_person_email",
        },
        {
            header: "Address",
            accessorKey: "address",
        },
        {
            header: "City",
            accessorKey: "city",
        },
        {
            header: "Country",
            accessorKey: "country",
        },
        {
            header: "Phone",
            accessorKey: "contact_phone_number",
        },
        {
            header: "Created at",
            accessorKey: "created_at",
            cell: ({ row }) => {
                return formatDateTimeToLocale(row.getValue("created_at"));
            },
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => {
                const status = row.getValue("status");
                return <StatusBadge status={status} />;
            },
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                            navigate(`/admin/shop-approvals/${row.original.id}`);
                        }}
                    >
                        Detail
                    </Button>
                </div>
            ),
        },
    ];
}
