import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Merchant Login - Shopera Dashboard",
    description: "Login to your Shopera Merchant Dashboard",
};

export default function RootLayout({ children }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
    );
}
