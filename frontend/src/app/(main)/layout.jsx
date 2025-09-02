import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { DynamicBreadcrumb } from "./_components/dynamic-breadcrumb";
import { Toaster } from "@/components/ui/sonner";
import ProgressBar from "@/components/shared/ProgressBar";
import "@/styles/nprogress.css";

export default function RootLayout({ children }) {
    return (
        <SidebarProvider>
            <ProgressBar />
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <DynamicBreadcrumb />
                    </div>
                </header>
                <div className="min-h-dvh bg-gray-50/50">
                    <div className="m-auto min-h-dvh">{children}</div>
                </div>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
