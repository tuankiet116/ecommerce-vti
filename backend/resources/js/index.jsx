import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import { routes } from "./lib/routes.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/index";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("app")).render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>,
);
