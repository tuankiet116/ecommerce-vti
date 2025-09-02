"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // tránh render khi chưa mounted => tránh mismatch
    }

    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
            {children}
        </NextThemesProvider>
    );
}
