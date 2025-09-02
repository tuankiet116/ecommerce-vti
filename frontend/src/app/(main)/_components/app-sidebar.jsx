"use client";

import * as React from "react";
import { BookOpen, Bot, Command, Frame, LifeBuoy, Map, PieChart, Send, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/app/(main)/_components/nav-main";
import { NavSecondary } from "@/app/(main)/_components/nav-secondary";
import { NavUser } from "@/app/(main)/_components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { TagIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AppSidebar({ ...props }) {
    const pathName = usePathname();

    const data = React.useMemo(
        () => ({
            user: {
                name: "shadcn",
                email: "m@example.com",
                avatar: "/avatars/shadcn.jpg",
            },
            navMain: [
                {
                    title: "Dashboard",
                    url: "/",
                    icon: LayoutDashboard,
                },
                {
                    title: "Products",
                    url: "/products",
                    icon: TagIcon,
                    isActive: pathName === "/products",
                    items: [
                        {
                            title: "Inventory",
                            url: "/products/inventory",
                        },
                    ],
                },
                {
                    title: "Collections",
                    url: "/collections",
                    icon: Bot,
                    isActive: pathName === "/collections",
                }
            ],
            navSecondary: [
                {
                    title: "Support",
                    url: "#",
                    icon: LifeBuoy,
                },
                {
                    title: "Feedback",
                    url: "#",
                    icon: Send,
                },
            ],
        }),
        [],
    );

    return (
        <Card className="bg-white p-0">
            <Sidebar variant="inset" {...props} className="bg-white m-0">
                <SidebarHeader className="bg-white">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <a href="#">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <Command className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Acme Inc</span>
                                        <span className="truncate text-xs">Enterprise</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent className="bg-white">
                    <NavMain items={data.navMain} />
                    <NavSecondary items={data.navSecondary} className="mt-auto" />
                </SidebarContent>
                <SidebarFooter className="bg-white">
                    <NavUser user={data.user} />
                </SidebarFooter>
            </Sidebar>
        </Card>
    );
}
