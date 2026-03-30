import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "@/features/auth/authSlice";
import RouterProgress from "@/components/shared/RouterProgress";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/layout/Footer";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Only fetch user data if not on public home page
        if (window.location.pathname !== '/') {
            dispatch(fetchMe()).unwrap().catch(() => {});
        }
    }, []);

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        fontSize: "13.5px",
                        fontWeight: 600,
                        borderRadius: "10px",
                    },
                }}
            />
            <RouterProgress />
            <AppRoutes />
            <Footer />
        </>
    );
}