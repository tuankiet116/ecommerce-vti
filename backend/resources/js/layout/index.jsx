import { AppSidebar } from "@/components/ultils/navbar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <Outlet />
            </SidebarInset>
            <Toaster position="bottom-center"/>
        </SidebarProvider>
    );
}
