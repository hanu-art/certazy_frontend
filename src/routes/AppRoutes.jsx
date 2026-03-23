import { Routes, Route, useLocation } from "react-router-dom";

// Layout
import NavBarIndex from "@/components/layout/Navbar/NavBarIndex";

// Public pages
import CoursesPage      from "@/pages/public/Courses/CoursesPage";
import CourseDetailPage from "@/pages/public/CourseDetail/CourseDetailIndex";

// Auth pages
import LoginPage     from "@/pages/Auth/LoginPage";
import RegisterPage  from "@/pages/Auth/RegisterPage";
import OAuthCallback from "@/pages/Auth/OAuthCallback";

/**
 * AppRoutes.jsx
 *
 * Route structure:
 *   Public  → no auth needed
 *   Student → ProtectedRoute (role: student)  — coming soon
 *   Admin   → ProtectedRoute (role: admin)    — coming soon
 */

// Auth pages pe navbar + scroll nahi chahiye
const AUTH_PATHS = ["/login", "/register", "/oauth/callback"];

export default function AppRoutes() {
    const { pathname } = useLocation();
    const isAuthPage   = AUTH_PATHS.includes(pathname);

    return (
        <>
            {/* Navbar — auth pages pe hidden */}
            {!isAuthPage && <NavBarIndex />}

            <Routes>

                {/* ── PUBLIC ── */}
                <Route path="/"          element={<div className="p-8 text-center text-text-secondary">HomePage coming soon</div>} />
                <Route path="/courses"   element={<CoursesPage />} />
                <Route path="/courses/:slug" element={<CourseDetailPage />} />

                {/* ── AUTH ── */}
                <Route path="/login"          element={<LoginPage />} />
                <Route path="/register"       element={<RegisterPage />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />

                {/* ── ADMIN — temporary ── */}
                <Route path="/admin/dashboard" element={
                    <div className="p-8 text-center text-text-secondary">
                        Admin Dashboard coming soon
                    </div>
                } />

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