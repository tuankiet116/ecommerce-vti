import * as React from "react";
import { IconFile3d, IconDashboard, IconHelp, IconInnerShadowTop, IconListDetails, IconSearch, IconSettings } from "@tabler/icons-react";

import { NavDocuments } from "@/components/ultils/navbar/nav-documents";
import { NavMain } from "@/components/ultils/navbar/nav-main";
import { NavSecondary } from "@/components/ultils/navbar/nav-secondary";
import { NavUser } from "@/components/ultils/navbar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMemo } from "react";
import { IconStack } from "../../../../../node_modules/@tabler/icons-react/dist/esm/tabler-icons-react";
import { Book } from "lucide-react";

export function AppSidebar({ ...props }) {
    const data = useMemo(
        () => ({
            user: {
                name: "Admin",
                email: "admin@example.com",
                avatar: null,
            },
            navMain: [
                {
                    title: "Dashboard",
                    url: "/admin",
                    icon: IconDashboard,
                },
                {
                    title: "Shop approvals",
                    url: "/admin/shop-approvals",
                    icon: IconListDetails,
                },
                {
                    title: "Categories",
                    url: "/admin/categories",
                    icon: IconStack,
                },
            ],
            navSecondary: [
                {
                    title: "Settings",
                    url: "#",
                    icon: IconSettings,
                },
                {
                    title: "Get Help",
                    url: "#",
                    icon: IconHelp,
                },
                {
                    title: "Search",
                    url: "#",
                    icon: IconSearch,
                },
            ],
            documents: [
                {
                    name: "System logs",
                    url: "/log-viewer",
                    icon: IconFile3d,
                },
                {
                    name: "API documentation",
                    url: "/docs",
                    icon: Book,
                },
            ],
        }),
        [],
    );
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <a href="#">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">Shopera Inc.</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
