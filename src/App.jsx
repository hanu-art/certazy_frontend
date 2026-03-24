import React from "react";
import RouterProgress from "@/components/shared/RouterProgress";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/layout/Footer";
export default function App() {
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
      <Footer/>
    </>
  );
}