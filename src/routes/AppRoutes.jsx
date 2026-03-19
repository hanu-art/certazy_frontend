


import { Routes, Route } from "react-router-dom";

// Layout
import NavBarIndex from "@/components/layout/Navbar/NavBarIndex";

// Public pages
import CoursesPage from "@/pages/public/Courses/CoursesPage"

/**
 * AppRoutes.jsx
 *
 * All routes centralized here.
 * Add new routes here only — never in App.jsx directly.
 *
 * Route structure:
 *   Public  → no auth needed
 *   Student → ProtectedRoute (role: student) — coming soon
 *   Admin   → ProtectedRoute (role: admin)   — coming soon
 */
export default function AppRoutes() {
    return (
        <>
            {/* Navbar — always visible */}
            <NavBarIndex />

            <Routes>
                {/* ── PUBLIC ── */}
                <Route path="/" element={<div className="p-8 text-center text-text-secondary">HomePage coming soon</div>} />
                <Route path="/courses" element={<CoursesPage />} />

                {/* ── 404 ── */}
                <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-[48px] font-extrabold text-primary">404</p>
                            <p className="text-[16px] text-text-secondary mt-2">Page not found</p>
                        </div>
                    </div>
                } />
            </Routes>
        </>
    );
}