import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import path from "path"; // Import the path module

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/index.jsx"],
            refresh: true,
        }),
        tailwindcss(),
        viteReact(),
    ],
    resolve: { // Add this resolve section
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
});
