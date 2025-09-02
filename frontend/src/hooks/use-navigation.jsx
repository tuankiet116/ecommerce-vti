"use client";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";

export default function useNavigation() {
    const router = useRouter();

    return {
        push: (href) => {
            nProgress.start();
            router.push(href);
        },
        replace: (href) => {
            nProgress.start();
            router.replace(href);
        },
    };
}
