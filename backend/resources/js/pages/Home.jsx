import React from "react";
import { AppSidebar } from "@/components/ultils/navbar/app-sidebar";
import { ChartAreaInteractive } from "@/components/home/chart-area-interactive";
import { DataTable } from "@/components/home/data-table";
import { SectionCards } from "@/components/home/section-cards";
import { SiteHeader } from "@/components/ultils/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Home(props) {
    return (
        <>
            <SiteHeader title="Dash board" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive />
                        </div>
                        <DataTable data={[]} />
                    </div>
                </div>
            </div>
        </>
    );
}
