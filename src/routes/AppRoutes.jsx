import { Routes, Route, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom"; // ← add karo

// Layout
import NavBarIndex      from "@/components/layout/Navbar/NavBarIndex";
import StudentLayout    from "@/components/layout/StudentLayout";

// Public pages
import CoursesPage      from "@/pages/public/Courses/CoursesPage";
import CourseDetailPage from "@/pages/public/CourseDetail/CourseDetailIndex";

// Auth pages
import LoginPage     from "@/pages/Auth/LoginPage";
import RegisterPage  from "@/pages/Auth/RegisterPage";
import OAuthCallback from "@/pages/Auth/OAuthCallback";

// Contact
import ContactPage from "@/pages/contact/ContactPage";

// Student pages
import DashboardPage      from "@/pages/student/DashboardPage";
import MyCoursesPage      from "@/pages/student/MyCoursesPage";
import CertificatesPage   from "@/pages/student/CertificatesPage";
import PaymentHistoryPage from "@/pages/student/PaymentHistoryPage";
import ProfilePage        from "@/pages/student/ProfilePage";
import CoursePlayerPage   from "@/pages/student/CoursePlayerPage";
import ProtectedRoute     from "@/components/shared/ProtectedRoute";

// checkout
import CheckoutPage from "@/pages/student/CheckoutPage/PaymentIndex";

const AUTH_PATHS    = ["/login", "/register", "/oauth/callback"];

export default function AppRoutes() {
    const { pathname } = useLocation();

    const isAuthPage    = AUTH_PATHS.includes(pathname);
    const isStudentPage = pathname.startsWith("/student");

    return (
        <>
            {!isAuthPage && !isStudentPage && <NavBarIndex />}

            <Routes>

                {/* ── PUBLIC ── */}
                <Route path="/" element={<div className="p-8 text-center text-text-secondary">HomePage coming soon</div>} />
                <Route path="/courses"      element={<CoursesPage />} />
                <Route path="/courses/:slug" element={<CourseDetailPage />} />
                <Route path="/contact"      element={<ContactPage />} />

                {/* ── AUTH ── */}
                <Route path="/login"          element={<LoginPage />} />
                <Route path="/register"       element={<RegisterPage />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />

                {/* ── STUDENT — sidebar layout ── */}
                <Route path="/student" element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <StudentLayout />
                    </ProtectedRoute>
                }>
                    <Route path="dashboard"    element={<DashboardPage />} />
                    <Route path="my-courses"   element={<MyCoursesPage />} />
                    <Route path="certificates" element={<CertificatesPage />} />
                    <Route path="payments"     element={<PaymentHistoryPage />} />
                    <Route path="profile"       element={<ProfilePage />} />
                </Route>
       
  
      {/* ── CHECKOUT ── */}
         <Route path="/checkout" element={
             <ProtectedRoute allowedRoles={["student"]}>
                 <CheckoutPage />
             </ProtectedRoute>
         } />


                {/* ── COURSE PLAYER — full screen, no sidebar ── */}
                <Route
                    path="/student/course/:courseId/learn"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <CoursePlayerPage />
                        </ProtectedRoute>
                    }
                />

                {/* ── ADMIN ── */}
                <Route path="/admin/dashboard" element={<div className="p-8 text-center text-text-secondary">Admin Dashboard coming soon</div>} />

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