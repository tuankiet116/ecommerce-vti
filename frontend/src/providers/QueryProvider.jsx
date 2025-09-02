"use client";

import { store } from "@/store";
import { keepPreviousData, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";

export const QueryProvider = ({ children }) => {
    const [isOpenDevTools, setIsOpenDevTools] = useState(false);
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1,
                staleTime: 1000 * 60 * 5, // 5 minutes
                refetchOnMount: "always",
                refetchOnReconnect: true,
                placeholderData: keepPreviousData,
            },
            mutations: {
                retry: 1,
            },
        },
    }));

    useEffect(() => {
        if (process.env.NODE_ENV != "production") {
            setIsOpenDevTools(true);
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>{children}</Provider>
            <ReactQueryDevtools initialIsOpen={isOpenDevTools} />
        </QueryClientProvider>
    );
};
