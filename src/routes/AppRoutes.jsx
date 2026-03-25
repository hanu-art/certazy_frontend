import { Routes, Route, useLocation } from "react-router-dom";

// Layout
import NavBarIndex from "@/components/layout/Navbar/NavBarIndex";

// Public pages
import CoursesPage from "@/pages/public/Courses/CoursesPage";
import CourseDetailPage from "@/pages/public/CourseDetail/CourseDetailIndex";

// Auth pages
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import OAuthCallback from "@/pages/Auth/OAuthCallback";

// Contact
import ContactPage from "@/pages/contact/ContactPage";

// Student
import StudentLayout from "@/components/layout/StudentLayout";
import DashboardPage from "@/pages/student/DashboardPage";
import MyCoursesPage from "@/pages/student/MyCoursesPage";
import CertificatesPage from "@/pages/student/CertificatesPage";
import PaymentHistoryPage from "@/pages/student/PaymentHistoryPage";

// Auth pages pe navbar nahi chahiye
const AUTH_PATHS = ["/login", "/register", "/oauth/callback"];

export default function AppRoutes() {
    const { pathname } = useLocation();

    const isAuthPage = AUTH_PATHS.includes(pathname);
    const isStudentPage = pathname.startsWith("/student");

    return (
        <>
            {/* Navbar hide on auth + student pages */}
            {!isAuthPage && !isStudentPage && <NavBarIndex />}

            <Routes>

                {/* ───── PUBLIC ROUTES ───── */}
                <Route
                    path="/"
                    element={
                        <div className="p-8 text-center text-text-secondary">
                            HomePage coming soon
                        </div>
                    }
                />

                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:slug" element={<CourseDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />


                {/* ───── AUTH ROUTES ───── */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />


                {/* ───── STUDENT ROUTES ───── */}
                <Route path="/student" element={<StudentLayout />}>

                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="my-courses" element={<MyCoursesPage />} />
                    <Route path="certificates" element={<CertificatesPage />} />
                    <Route path="payments" element={<PaymentHistoryPage />} />

                </Route>


                {/* ───── ADMIN (temporary) ───── */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <div className="p-8 text-center text-text-secondary">
                            Admin Dashboard coming soon
                        </div>
                    }
                />


                {/* ───── 404 ───── */}
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-[48px] font-extrabold text-primary">
                                    404
                                </p>
                                <p className="text-[16px] text-text-secondary mt-2">
                                    Page not found
                                </p>
                            </div>
                        </div>
                    }
                />

            </Routes>
        </>
    );
}