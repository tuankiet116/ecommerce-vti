"use client";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import { useEffect } from "react";

export default function ProgressBar() {
    const pathname = usePathname();
    NProgress.configure({
        showSpinner: false,
        minimum: 0.15,
        trickleSpeed: 200,
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            NProgress.done();
        }, 400);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return null;
}
