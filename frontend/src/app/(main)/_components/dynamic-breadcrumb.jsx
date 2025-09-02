"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export function DynamicBreadcrumb() {
    const pathname = usePathname();
    const pathParts = pathname.split("/").filter(Boolean);

    // Tạo breadcrumb path từng phần
    const breadcrumbs = pathParts.map((part, index) => {
        const href = "/" + pathParts.slice(0, index + 1).join("/");
        const isLast = index === pathParts.length - 1;

        return (
            <React.Fragment key={href}>
                {index !== 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                    {isLast ? (
                        <BreadcrumbPage>{formatBreadcrumbLabel(part)}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink href={href}>{formatBreadcrumbLabel(part)}</BreadcrumbLink>
                    )}
                </BreadcrumbItem>
            </React.Fragment>
        );
    });

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbs}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

function formatBreadcrumbLabel(str) {
    return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize
}
