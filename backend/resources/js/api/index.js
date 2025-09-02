import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 1000 * 60 * 30, // 10 phút
            refetchOnMount: true,
            refetchOnReconnect: true,
            keepPreviousData: true,
        },
        mutations: {
            retry: false,
        },
    },
});
