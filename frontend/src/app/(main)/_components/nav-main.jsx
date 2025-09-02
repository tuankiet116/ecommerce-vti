"use client";

import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import useNavigation from "@/hooks/use-navigation";

export function NavMain({ items }) {
    const router = useNavigation();
    return (
        <SidebarMenu>
            {items.map((item) => (
                <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={item.title}>
                            <a onClick={() => router.push(item.url)} className="cursor-pointer flex items-center gap-2">
                                <item.icon />
                                <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                        {item.items?.length ? (
                            <>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                                        <ChevronRight />
                                        <span className="sr-only">Toggle</span>
                                    </SidebarMenuAction>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <a onClick={() => router.push(subItem.url)} className="cursor-pointer flex items-center gap-2">
                                                        <span>{subItem.title}</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </>
                        ) : null}
                    </SidebarMenuItem>
                </Collapsible>
            ))}
        </SidebarMenu>
    );
}
