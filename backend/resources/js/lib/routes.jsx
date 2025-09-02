import instance from "@/api/axiosInstance";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { BrowserRouter, Outlet, redirect, Route } from "react-router-dom";
import Layout from "@/layout";
import ShopApprovals from "@/pages/ShopApprovals/index";
import ShopDetail from "@/pages/ShopApprovals/ShopDetail";
import Category from "@/pages/Category/index";

const redirectIfNotAuth = async () => {
    try {
        const response = await instance.get("check-auth");
        if (!response.data?.loggedin) {
            return redirect("/admin/login");
        }
        return null;
    } catch (error) {
        console.error("Error in redirectIfNotAuth:", error);
        return redirect("/admin/login");
    }
};

const redirectIfLoggedIn = async () => {
    try {
        const response = await instance.get("check-auth");
        if (response.data?.loggedin) {
            return redirect("/admin");
        }
        return null;
    } catch (error) {
        console.error("Error in redirectIfLoggedIn:", error);
        return null;
    }
};

export const routes = [
    {
        path: "admin",
        Component: Layout,
        loader: redirectIfNotAuth,
        children: [
            {
                path: "",
                Component: Home,
            },
            {
                path: "shop-approvals",
                Component: Outlet,
                children: [
                    {
                        path: "",
                        Component: ShopApprovals,
                    },
                    {
                        path: ":shopId",
                        Component: ShopDetail,
                    },
                ],
            },
            {
                path: "categories",
                Component: Category,
            },
        ],
    },
    {
        path: "admin/login",
        Component: Login,
        loader: redirectIfLoggedIn,
    },
];
