import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";

export function NavMain({ items }) {
    const location = useLocation();
    const currentPath = location?.pathname;

    const checkIsActive = (url) => {
        let currentPaths = currentPath.split("/");
        let urlPaths = url.split("/");
        return currentPaths[2] === urlPaths[2];
    };

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <Link to={item.url} className="flex items-center gap-2">
                                <SidebarMenuButton tooltip={item.title} isActive={checkIsActive(item.url)}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
